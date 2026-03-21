"use client";

import { useState, useEffect } from "react";
import { toggleTask as serverToggleTask } from "@/app/actions/toggleTask";
import { deleteTask as serverDeleteTask } from "@/app/actions/deleteTask";
import { getDeleteConfirmationSetting } from "@/app/actions/settings";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Trash2, Calendar, Clock, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteTaskModal } from "@/components/modals/delete-task-modal";
import { Subtask, Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import SubtaskSheet from "./subtask-sheet";
import { Separator } from "./ui/separator";
import EditTaskModal from "@/components/modals/edit-task-modal";

type PriorityVariant = "default" | "secondary" | "destructive";

interface PriorityConfig {
  variant: PriorityVariant;
  label: string;
}

interface ManageTasksProps {
  tasks: Task[];
}

const priorityConfig: Record<string, PriorityConfig> = {
  high: { variant: "destructive", label: "Alta" },
  medium: { variant: "default", label: "Media" },
  low: { variant: "secondary", label: "Baja" },
};

interface SectionTaskProps {
  tasks: Task[];
  title: string;
  onDelete: (task: Task) => void;
}

function SectionTask({ tasks, title, onDelete }: SectionTaskProps) {
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true);

  useEffect(() => {
    getDeleteConfirmationSetting().then(setConfirmBeforeDelete);
  }, []);


  const handleToggle = async (taskId: string) => {
    const result = await serverToggleTask(taskId);
    const success = result.success;

    if (success) {
      toast.success("Tarea actualizada");
    } else {
      toast.error("Error al actualizar");
    }
  };

  const performDelete = async (taskId: string) => {
    const result = await serverDeleteTask(taskId);
    const success = result.success;

    if (success) {
      toast.success("Tarea eliminada");
    } else {
      toast.error("Error al eliminar");
    }
  };


  const handleDelete = (task: Task) => {
    if (confirmBeforeDelete) {
      onDelete(task);
    } else {
      performDelete(task.id);
    }
  };

  return <div>
    <h2 className="text-lg font-semibold mb-3">{title} ({tasks.length})</h2>
    <div className="space-y-2">
      {tasks.map((task) => {
        const priority = priorityConfig[task.priority];
        return (
          <ManageTaskCard
            key={task.id}
            task={task}
            priority={priority}
            onToggle={() => handleToggle(task.id)}
            onDelete={() => handleDelete(task)}
          />
        );
      })}
    </div>
  </div>
}

export default function ManageTasks({ tasks }: ManageTasksProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  const handleDelete = (task: Task) => {
    setTaskToDelete({ id: task.id, title: task.title });
    setShowDeleteModal(true);
  };

  return (
    <>

      <div className="space-y-6">
        {pendingTasks.length > 0 && <SectionTask tasks={pendingTasks} title="Pendientes" onDelete={handleDelete} />}
        {completedTasks.length > 0 && <SectionTask tasks={completedTasks} title="Completadas" onDelete={handleDelete} />}
        {tasks.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No hay tareas todavía.</p>
        )}
      </div>

      <DeleteTaskModal
        taskId={taskToDelete?.id || ""}
        taskTitle={taskToDelete?.title || ""}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTaskToDelete(null);
        }}
      />
    </>
  );
}

interface ManageTaskCardProps {
  task: Task;
  priority: PriorityConfig;
  onToggle: () => void;
  onDelete: () => void;
}

function ManageTaskCard({ task, priority, onToggle, onDelete }: ManageTaskCardProps) {
  const [openModal, setOpenModal] = useState({ edit: false});
  const now = new Date();

  const isActive = task.startTime && task.endTime && !task.completed &&
    now >= new Date(task.startTime) && now <= new Date(task.endTime);

  return (
    <>
      <EditTaskModal task={task} isOpen={openModal.edit} setIsOpen={(open) => setOpenModal({ ...openModal, edit: open })} />
      <div className="relative">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors",
          task.completed && "opacity-60"
        )}>
          <Button
            type="button"
            size="icon"
            variant={task.completed ? "default" : "secondary"}
            className="h-8 w-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <Check className="h-4 w-4" />
          </Button>

          <div className="flex-1 min-w-0">
            <p className={cn(
              "font-medium truncate",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-1 h-5">
              {isActive && (
                <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-[10px] h-5">
                  En proceso
                </Badge>
              )}
              <Badge variant={priority.variant} className="text-[10px] h-5">
                {priority.label}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(task.dueDate), "dd MMM", { locale: es })}
              </span>
              {task.startTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(task.startTime), "HH:mm")}
                  {task.endTime && ` - ${format(new Date(task.endTime), "HH:mm")}`}
                </span>
              )}
              {task.subtasks.length > 0 && (<>
                <Separator orientation="vertical" />
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  Completado ({`${task.subtasks.filter((s: Subtask) => s.completed).length}/${task.subtasks.length}`})
                </span>
              </>
              )}
            </div>
          </div>

          <div className="flex gap-1 shrink-0">
            <SubtaskSheet task={task} subtasks={task.subtasks} />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => {
                setOpenModal({ ...openModal, edit: true });
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => {
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
