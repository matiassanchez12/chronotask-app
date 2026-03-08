"use client";

import { useState, useEffect } from "react";
import { toggleTask } from "@/app/actions/toggleTask";
import { deleteTask } from "@/app/actions/deleteTask";
import { getDeleteConfirmationSetting } from "@/app/actions/settings";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteTaskModal } from "@/components/deleteTaskModal";
import EditTaskDialog from "@/components/editTaskDialog";
import { Task } from "@/generated/prisma/client";

type PriorityVariant = "default" | "secondary" | "destructive";

interface PriorityConfig {
  variant: PriorityVariant;
  label: string;
}

export default function TaskCard({ task }: { task: Task }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true);

  useEffect(() => {
    getDeleteConfirmationSetting().then(setConfirmBeforeDelete);
  }, []);

  const handleDelete = async () => {
    if (confirmBeforeDelete) {
      setShowDeleteModal(true);
    } else {
      const result = await deleteTask(task.id);
      if (result.success) {
        toast.success("Tarea eliminada");
      } else {
        toast.error(result.error);
      }
    }
  };

  const priorityConfig: Record<string, PriorityConfig> = {
    high: { variant: "destructive", label: "Alta" },
    medium: { variant: "default", label: "Media" },
    low: { variant: "secondary", label: "Baja" },
  };

  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const handleToggle = async () => {
    const result = await toggleTask(task.id);
    if (result.success) {
      toast.success("Task updated");
    } else {
      toast.error(result.error);
    }
  };

  const cardContent = (
    <div className="flex bg-card rounded-xl overflow-hidden border border-border/60 hover:border-border hover:shadow-sm transition-all duration-200 group">
      <div className={`w-1.5 ${task.priority === "high" ? "bg-destructive" : task.priority === "medium" ? "bg-primary" : "bg-secondary"}`} />

      <div className="p-4 flex-1 space-y-3">
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1.5 min-w-0">
            <p
              className={`text-[15px] font-medium leading-snug truncate ${
                task.completed
                  ? "line-through text-muted-foreground/70"
                  : ""
              }`}
            >
              {task.title}
            </p>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={priority.variant} className="text-[11px] h-5">
                {priority.label}
              </Badge>
            </div>
          </div>

          <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              size="icon"
              variant={task.completed ? "default" : "secondary"}
              className="h-8 w-8"
              onClick={handleToggle}
            >
              <Check className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {format(new Date(task.dueDate), "dd MMM yyyy", {
                locale: es,
              })}
            </span>
          </div>
          {task.startTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {format(new Date(task.startTime), "HH:mm")}
                {task.endTime && ` - ${format(new Date(task.endTime), "HH:mm")}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <EditTaskDialog task={task} trigger={cardContent} />
      <DeleteTaskModal
        taskId={task.id}
        taskTitle={task.title}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}