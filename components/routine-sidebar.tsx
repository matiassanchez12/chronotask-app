"use client";

import { useState } from "react";
import { toggleTask as serverToggleTask } from "@/app/actions/toggleTask";
import { toast } from "sonner";
import { format } from "date-fns";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import EditTaskModal from "@/components/modals/edit-task-modal";

interface RoutineTask extends Task {
  subtasks?: { id: string; description: string; completed: boolean }[];
}

interface RoutineSidebarProps {
  routines: RoutineTask[];
}

export default function RoutineSidebar({ routines }: RoutineSidebarProps) {
  const toggleComplete = async (taskId: string) => {
    const result = await serverToggleTask(taskId);
    if (!result.success) {
      toast.error("Error al actualizar");
    }
  };

  if (routines.length === 0) return null;

  return (
    <div className="w-64 border-r border-border/50 pr-4 flex flex-col h-full">
      <div className="sticky top-0 bg-background pb-2 mb-3 border-b border-border/30">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Rutinas
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Tareas que se repiten daily
        </p>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {routines.map((task) => (
          <RoutineCard key={task.id} task={task} onToggle={toggleComplete} />
        ))}
      </div>
    </div>
  );
}

function RoutineCard({
  task,
  onToggle,
}: {
  task: RoutineTask;
  onToggle: (id: string) => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const startTime = task.startTime ? format(new Date(task.startTime), "HH:mm") : null;
  const endTime = task.endTime ? format(new Date(task.endTime), "HH:mm") : null;

  return (
    <>
      <EditTaskModal
        task={task}
        isOpen={openModal}
        setIsOpen={setOpenModal}
      />
      <div
        className={cn(
          "p-3 rounded-lg border bg-card/50 hover:bg-card transition-all group cursor-pointer",
          task.completed && "opacity-60"
        )}
        onClick={() => setOpenModal(true)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm font-medium truncate",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </p>
            {(startTime || endTime) && (
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {startTime && endTime
                    ? `${startTime} - ${endTime}`
                    : startTime || endTime}
                </span>
              </div>
            )}
          </div>
            <Button
              size="sm"
              variant="ghost"
              className="shrink-0 opacity-0 group-hover:opacity-100 h-7 w-7 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(task.id);
              }}
            >
              <Check className={cn("h-4 w-4", task.completed && "text-green-500")} />
            </Button>
        </div>
      </div>
    </>
  );
}