"use client";

import { useState, useEffect } from "react";
import { formatDuration, getPhaseStyles, TimerMode, Phase } from "@/lib/pomodoro";
import { useTimer } from "./use-timer";
import { TimerDisplay } from "./timer-display";
import { ProgressBar } from "./progress-bar";
import { TimerBadge } from "./timer-badge";
import { format } from "date-fns";
import SubtaskSheet from "@/components/subtask-sheet";
import { Task } from "@/generated/prisma/client";
import { tips } from "@/lib/tips";

interface TimerCardProps {
  task: Task;
  mode: TimerMode;
  durations?: { work: number; shortBreak: number; longBreak: number };
  onComplete: (taskId: string, workMinutes: number, breakMinutes: number) => void;
}

export function TimerCard({ task, mode, durations, onComplete }: TimerCardProps) {
  const { phase, timeRemaining, elapsed, progress, currentSessionIndex, totalSessions, isLowTime, completedSubtasks, totalSubtasks } = 
    useTimer({ task, mode, durations, onComplete });

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (phase === "completed") return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [phase]);

  if (!task.startTime || !task.endTime) return null;

  const phaseStyles = getPhaseStyles(phase);

  return (
    <div className={`bg-card rounded-xl overflow-hidden border-2 shadow-sm ${phaseStyles}`}>
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate">{task.title}</h3>
            <p className="text-xs text-muted-foreground">
              {format(new Date(task.startTime), "HH:mm")} - {format(new Date(task.endTime), "HH:mm")}
            </p>
          </div>
          <TimerBadge mode={mode} phase={phase} />
        </div>

        <TimerDisplay
          timeRemaining={timeRemaining}
          elapsed={elapsed}
          phase={phase}
          isLowTime={isLowTime}
          mode={mode}
          currentSession={currentSessionIndex}
          totalSessions={totalSessions}
        />

        <div className="space-y-2">
          {phase !== "completed" && (
            <div className="p-2 bg-muted/50 rounded-md flex items-center gap-2">
              <span className="text-xs">💡</span>
              <span className="text-xs text-muted-foreground truncate">{tips[tipIndex]}</span>
            </div>
          )}
          <SubtaskSheet
            task={task}
            subtasks={(task as any).subtasks ?? []}
            buttonText={totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks}` : "-"}
          />
          <ProgressBar progress={progress} />
        </div>

        {phase === "completed" && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              {mode === "pomodoro" ? "¡Todas las sesiones completadas!" : "¡Tiempo completado!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
