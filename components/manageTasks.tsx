"use client";

import { useState, useEffect } from "react";
import { toggleTask as serverToggleTask } from "@/app/actions/toggleTask";
import { deleteTask as serverDeleteTask } from "@/app/actions/deleteTask";
import { getDeleteConfirmationSetting } from "@/app/actions/settings";
import { toggleLocalTask, deleteLocalTask } from "@/lib/localUser";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Trash2, Calendar, Clock, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteTaskModal } from "@/components/deleteTaskModal";
import EditTaskDialog from "@/components/editTaskDialog";
import { Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import ManageFilters from "./filters";

const isLocalTask = (id: string) => id.startsWith("local-");

type PriorityVariant = "default" | "secondary" | "destructive";

interface PriorityConfig {
  variant: PriorityVariant;
  label: string;
}

interface ManageTasksProps {
  tasks: Task[];
}

export default function ManageTasks({ tasks }: ManageTasksProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true);

  useEffect(() => {
    getDeleteConfirmationSetting().then(setConfirmBeforeDelete);
  }, []);

  const handleDelete = (task: Task) => {
    if (confirmBeforeDelete) {
      setTaskToDelete({ id: task.id, title: task.title });
      setShowDeleteModal(true);
    } else {
      performDelete(task.id);
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

  const handleToggle = async (taskId: string) => {
    const result = await serverToggleTask(taskId);
    const success = result.success;

    if (success) {
      toast.success("Tarea actualizada");
    } else {
      toast.error("Error al actualizar");
    }
  };

  const priorityConfig: Record<string, PriorityConfig> = {
    high: { variant: "destructive", label: "Alta" },
    medium: { variant: "default", label: "Media" },
    low: { variant: "secondary", label: "Baja" },
  };

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <>
      <ManageFilters />
      <div className="space-y-6">
        {pendingTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Pendientes ({pendingTasks.length})</h2>
            <div className="space-y-2">
              {pendingTasks.map((task) => {
                const priority = priorityConfig[task.priority] || priorityConfig.medium;
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
        )}

        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-muted-foreground">
              Completadas ({completedTasks.length})
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => {
                const priority = priorityConfig[task.priority] || priorityConfig.medium;
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
        )}

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
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 5000);
    return () => clearInterval(interval);
  }, []);

  const isActive = task.startTime && task.endTime && !task.completed &&
    now >= new Date(task.startTime) && now <= new Date(task.endTime);

  const cardContent = (
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
        <div className="flex items-center gap-2 mt-1">
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
        </div>
      </div>

      <div className="flex gap-1 shrink-0">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <EditTaskDialog task={task} trigger={cardContent} />
  );
}
