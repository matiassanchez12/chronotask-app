"use client";

import { useState, memo, useCallback, useEffect } from "react";
import { toggleTask as serverToggleTask } from "@/app/actions/toggleTask";
import { deleteTask as serverDeleteTask } from "@/app/actions/deleteTask";
import { getDeleteConfirmationSetting } from "@/app/actions/settings";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, Trash2, Clock, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Subtask, Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import SubtaskSheet from "../subtask-sheet";
import EditTaskModal from "@/components/modals/edit-task-modal";

type PriorityVariant = "default" | "secondary" | "destructive";

interface PriorityConfig {
  variant: PriorityVariant;
  label: string;
}

interface TaskWithSubtasks extends Task {
  subtasks?: Subtask[];
}

interface TaskCardProps {
  task: TaskWithSubtasks;
  priority: PriorityConfig;
  onDelete: () => void;
}

const priorityConfig: Record<string, PriorityConfig> = {
  high: { variant: "destructive", label: "Alta" },
  medium: { variant: "default", label: "Media" },
  low: { variant: "secondary", label: "Baja" },
};

function TaskCardInner({
  task,
  priority,
  onDelete,
}: {
  task: TaskWithSubtasks;
  priority: PriorityConfig;
  onDelete: () => void;
}) {
  const [openModal, setOpenModal] = useState({ edit: false });
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState<boolean | null>(null);
  const [optimisticCompleted, setOptimisticCompleted] = useState(task.completed);
  const now = new Date();

  useEffect(() => {
    setOptimisticCompleted(task.completed);
  }, [task.completed]);

  useEffect(() => {
    getDeleteConfirmationSetting().then(setConfirmBeforeDelete);
  }, []);

  const isActive =
    task.startTime &&
    task.endTime &&
    !optimisticCompleted &&
    now >= new Date(task.startTime) &&
    now <= new Date(task.endTime);

  const handleToggle = useCallback(async () => {
    setOptimisticCompleted(!task.completed);
    const result = await serverToggleTask(task.id);
    if (!result.success) {
      setOptimisticCompleted(task.completed);
      toast.error("Error al actualizar");
    }
  }, [task.id, task.completed, serverToggleTask, setOptimisticCompleted]);

  const handleDelete = useCallback(async () => {
    if (confirmBeforeDelete === null) return;
    
    if (confirmBeforeDelete) {
      onDelete();
    } else {
      const result = await serverDeleteTask(task.id);
      if (result.success) {
        toast.success("Tarea eliminada");
      } else {
        toast.error("Error al eliminar");
      }
    }
  }, [confirmBeforeDelete, onDelete, task.id]);
  console.log(task)
  return (
    <>
      <EditTaskModal
        task={task}
        isOpen={openModal.edit}
        setIsOpen={(open) => setOpenModal({ ...openModal, edit: open })}
      />
      <div className="relative overflow-x-hidden max-w-full">
        <div
          className={cn(
            "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors",
            optimisticCompleted && "opacity-60"
          )}
        >
          <Button
            type="button"
            size="icon"
            variant={optimisticCompleted ? "default" : "secondary"}
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
          >
            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>

          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-medium text-sm sm:text-base truncate max-w-[calc(100%-40px)]",
                optimisticCompleted && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1 h-4 sm:h-5 ">
              {isActive && (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-[10px] h-4 sm:h-5 shrink-0">
                  En proceso
                </Badge>
              )}
              {task.startTime && (
                <span className="text-[10px] sm:text-xs text-muted-foreground items-center gap-1 hidden sm:flex">
                  <Clock className="h-3 w-3" />
                  {format(new Date(task.startTime), "HH:mm")}
                  {task.endTime && ` - ${format(new Date(task.endTime), "HH:mm")}`}
                </span>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate shrink-0">
                  {task.subtasks.filter((s: Subtask) => s.completed).length}/{task.subtasks.length}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-0.5 sm:gap-1 shrink-0">
            <SubtaskSheet task={task} subtasks={task.subtasks!} buttonClasses="h-7 w-7 sm:h-8 sm:w-8" />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground"
              onClick={() => setOpenModal({ ...openModal, edit: true })}
            >
              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hidden sm:flex"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export const TaskCard = memo(TaskCardInner);

export { priorityConfig };
export type { TaskWithSubtasks, PriorityConfig };
