"use client";

import { useState, memo, useOptimistic } from "react";
import { toggleTask as serverToggleTask } from "@/app/actions/toggleTask";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, Clock, Edit2Icon } from "lucide-react";
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

interface TaskCardCompactProps {
  task: TaskWithSubtasks;
  priority: PriorityConfig;
  onToggle: () => void;
}

const priorityConfig: Record<string, PriorityConfig> = {
  high: { variant: "destructive", label: "Alta" },
  medium: { variant: "default", label: "Media" },
  low: { variant: "secondary", label: "Baja" },
};

function TaskCardCompactInner({
  task,
  priority,
  onToggle,
}: {
  task: TaskWithSubtasks;
  priority: PriorityConfig;
  onToggle: () => void;
}) {
  const [openModal, setOpenModal] = useState({ edit: false });
  const [isLoading, setIsLoading] = useState(false);
  const now = new Date();
  const isActive =
    task.startTime &&
    task.endTime &&
    !task.completed &&
    now >= new Date(task.startTime) &&
    now <= new Date(task.endTime);

  const toggleComplete = async () => {
    setIsLoading(true);
    const result = await serverToggleTask(task.id);

    if (!result.success) {
      toast.error("Error al actualizar la tarea");
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      <EditTaskModal
        task={task}
        isOpen={openModal.edit}
        setIsOpen={(open) => setOpenModal({ ...openModal, edit: open })}
      />
      <div
        className={cn(
          "flex items-center gap-2 p-2 w-full min-h-[58px] rounded-md border bg-card/50 hover:bg-card transition-colors text-sm group relative",
          task.completed && "opacity-60"
        )}
      >
        <div className="flex-1 flex min-w-0 flex-col gap-2">
          <div className="flex flex-row justify-between gap-2">
            <p
              className={cn(
                "font-medium truncate text-xs",
                task.completed && "line-through text-muted-foreground"
              )}
              title={task.title}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:dark:bg-blue-600/60 group-hover:bg-cyan-600/20 group-hover:rounded-xl group-hover:rounded-4 group-hover:p-1 transition-opacity">
              <Button size="sm" variant="ghost" disabled={isLoading} className="h-7 w-7" onClick={toggleComplete}>
                <Check />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7" onClick={() => setOpenModal({ ...openModal, edit: true })}>
                <Edit2Icon />
              </Button>
              <SubtaskSheet task={task} subtasks={task.subtasks!} buttonClasses="text-normal h-7 w-7" />
            </div>
          </div>
          <div className="flex flex-row gap-2">
            {isActive && (
              <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-[10px] h-5">
                En proceso
              </Badge>
            )}
            {task.startTime && (
              <span className="text-xs text-muted-foreground items-center gap-1 xl:flex hidden">
                <Clock className="h-3 w-3" />
                {format(new Date(task.startTime), "HH:mm")}
                {task.endTime && ` - ${format(new Date(task.endTime), "HH:mm")}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const TaskCardCompact = memo(TaskCardCompactInner);

export { priorityConfig };
export type { TaskWithSubtasks, PriorityConfig };
