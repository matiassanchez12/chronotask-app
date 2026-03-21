"use client";

import { useState, useEffect, useCallback } from "react";
import { Subtask, Task } from "@/generated/prisma/client";
import { format } from "date-fns";
import { Clock, Lightbulb } from "lucide-react";
import { completeTask as serverCompleteTask } from "@/app/actions/completeTask";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SubtaskSheet from "./subtask-sheet";

interface TaskWithSubtasks extends Task {
  subtasks?: Subtask[];
}

interface TaskTimerProps {
  task: TaskWithSubtasks;
}

export default function TaskTimer({ task }: TaskTimerProps) {
  const [now, setNow] = useState(() => new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const tips = [
    "Recuerda tomar descansos regulares para mantener la productividad.",
    "Elimina distracciones para concentrarte mejor en tu tarea.",
    "Divide tareas grandes en subtareas más pequeñas y manejables.",
    "Utiliza la técnica Pomodoro para mejorar tu enfoque.",
    "Asegúrate de tener un ambiente de trabajo cómodo y bien iluminado."
  ];
  const currentTip = tips[currentTipIndex];

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const startTime = task.startTime ? new Date(task.startTime) : null;
  const endTime = task.endTime ? new Date(task.endTime) : null;

  const totalDuration = startTime && endTime ? endTime.getTime() - startTime.getTime() : 0;
  const elapsed = startTime ? now.getTime() - startTime.getTime() : 0;
  const remaining = Math.max(0, totalDuration - elapsed);
  const progress = totalDuration > 0 ? Math.min(100, (elapsed / totalDuration) * 100) : 0;
  const isLowTime = remaining > 0 && remaining <= 5 * 60 * 1000;

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = useCallback(async () => {
    if (isCompleted || !startTime) return;
    setIsCompleted(true);
    const result = await serverCompleteTask(task.id, Math.floor(elapsed / 60000), 0);

    if (result.success) {
      toast.success("Tarea completada");
    } else {
      toast.error("Error al completar");
    }
  }, [isCompleted, task.id, elapsed, startTime]);

  useEffect(() => {
    if (remaining === 0 && !isCompleted && startTime && endTime) {
      handleComplete();
    }
  }, [remaining, isCompleted, handleComplete, startTime, endTime]);

  if (!startTime || !endTime) return null;

  return (
    <div className="bg-card rounded-xl overflow-hidden border-2 border-primary/5 dark:border-primary/10 shadow-sm">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold truncate">{task.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">
            Timer
          </Badge>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Restante</p>
            <p className={`text-4xl font-mono font-bold text-primary tabular-nums ${isLowTime ? "animate-pulse" : ""}`}>
              {formatTime(remaining)}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Transcurrido</p>
            <p className="text-lg font-mono text-foreground tabular-nums">
              {formatTime(elapsed)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <SubtaskSheet
            task={task}
            subtasks={task.subtasks!}
            buttonText={task.subtasks && task.subtasks.length > 0 ? `${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length}` : "-"}
          />
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Lightbulb className={`h-4 w-4 shrink-0 text-primary`} />
            <p className="text-xs text-muted-foreground leading-relaxed">{currentTip}</p>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export type { TaskTimerProps };
