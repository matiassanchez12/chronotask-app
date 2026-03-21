"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Subtask, Task } from "@/generated/prisma/client";
import { format } from "date-fns";
import { Laptop, Coffee, CheckCircle2, SkipForward, Lightbulb, Workflow } from "lucide-react";
import { completeTask as serverCompleteTask } from "@/app/actions/completeTask";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { calculateTaskPomodoros, workTips, breakTips, getPhaseColor, getPhaseLabel, getActiveSessionInfo } from "@/lib/task";
import SubtaskSheet from "./subtask-sheet";

interface TaskWithSubtask extends Task {
  subtasks?: Subtask[];
}

interface TaskPomodoroProps {
  task: TaskWithSubtask;
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

function getPhaseIcon(phase: string) {
  switch (phase) {
    case "work": return <Laptop className="h-8 w-8" />;
    case "break": return <Coffee className="h-8 w-8" />;
    case "completed": return <CheckCircle2 className="h-8 w-8" />;
    default: return null;
  }
}

export default function TaskPomodoro({ task, pomodoroDuration, shortBreakDuration, longBreakDuration }: TaskPomodoroProps) {
  const pomodoros = calculateTaskPomodoros(task, pomodoroDuration, shortBreakDuration, longBreakDuration);
  const [now, setNow] = useState(() => new Date());
  const { sessionIndex: initialSession, secondsElapsed: initialSeconds } = now && pomodoros?.length
    ? getActiveSessionInfo(pomodoros, now)
    : { sessionIndex: 0, secondsElapsed: 0 };
  const [currentPomodoroIndex, setCurrentPomodoroIndex] = useState(initialSession);
  const [secondsInCurrentPhase, setSecondsInCurrentPhase] = useState(initialSeconds);
  const [isCompleted, setIsCompleted] = useState(false);
  const [accumulatedTime, setAccumulatedTime] = useState<{ work: number; break: number }>({ work: 0, break: 0 });
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentPomodoro = pomodoros?.[currentPomodoroIndex];
  const isBreak = currentPomodoroIndex % 2 === 1;

  const phaseDurationSeconds = currentPomodoro
    ? (isBreak ? shortBreakDuration * 60 : pomodoroDuration * 60)
    : 0;

  const phase = !pomodoros || pomodoros.length === 0 || !currentPomodoro
    ? "idle"
    : secondsInCurrentPhase >= phaseDurationSeconds
      ? (currentPomodoroIndex >= pomodoros.length - 1 ? "completed" : (isBreak ? "break" : "work"))
      : isBreak
        ? "break"
        : "work";

  const timeRemaining = currentPomodoro
    ? Math.max(0, phaseDurationSeconds - secondsInCurrentPhase)
    : 0;

  const handleComplete = useCallback(async () => {
    if (isCompleted) return;

    setIsCompleted(true);

    const result = await serverCompleteTask(task.id, accumulatedTime.work, accumulatedTime.break);

    if (result.success) {
      toast.success("Tarea completada");
    } else {
      toast.error("Error al completar");
    }
  }, [isCompleted, task.id, accumulatedTime]);

  const handleAdvance = useCallback(() => {
    if (!currentPomodoro) return;

    const remaining = Math.max(0, phaseDurationSeconds - secondsInCurrentPhase);

    if (!isBreak) {
      setAccumulatedTime(prev => ({ ...prev, work: prev.work + remaining }));
    } else {
      setAccumulatedTime(prev => ({ ...prev, break: prev.break + remaining }));
    }

    if (currentPomodoroIndex >= pomodoros.length - 1) {
      handleComplete();
      return;
    }

    setCurrentPomodoroIndex(prev => prev + 1);
    setSecondsInCurrentPhase(0);
  }, [currentPomodoro, currentPomodoroIndex, phaseDurationSeconds, secondsInCurrentPhase, isBreak, handleComplete, pomodoros.length]);

  useEffect(() => {
    if (phase === "completed" && !isCompleted) {
      handleComplete();
    }
  }, [phase, isCompleted, handleComplete]);

  useEffect(() => {
    if (phase === "work" || phase === "break") {
      const interval = setInterval(() => {
        setSecondsInCurrentPhase(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSecondsInCurrentPhase(0);
  }, [currentPomodoroIndex]);

  useEffect(() => {
    const tips = phase === "work" ? workTips : breakTips;
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % tips.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    setCurrentTipIndex(0);
  }, [currentPomodoroIndex]);

  const currentTip = phase === "work" ? workTips[currentTipIndex % workTips.length] : breakTips[currentTipIndex % breakTips.length];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalPomodoros = pomodoros ? Math.ceil(pomodoros.length / 2) : 0;
  const completedPomodoros = Math.floor((currentPomodoroIndex + 1) / 2);

  const handleSessionClick = useCallback((index: number) => {
    setCurrentPomodoroIndex(index);
    setSecondsInCurrentPhase(0);
  }, []);

  const renderPomodoroBar = (pomodoroIndex: number) => {
    const workIndex = pomodoroIndex * 2;
    const breakIndex = workIndex + 1;
    const workPomodoro = pomodoros?.[workIndex];
    const breakPomodoro = pomodoros?.[breakIndex];
    const isLongBreak = breakPomodoro?.isLongBreak;
    const isLastGroup = !pomodoros?.[breakIndex + 1];

    if (!workPomodoro) return null;

    const activePomodoroIndex = Math.floor(currentPomodoroIndex / 2);

    const isWorkActive = activePomodoroIndex === pomodoroIndex && phase === "work";
    const isWorkCompleted = activePomodoroIndex > pomodoroIndex ||
      (activePomodoroIndex === pomodoroIndex && (phase === "break" || phase === "completed"));

    const isBreakActive = activePomodoroIndex === pomodoroIndex && phase === "break";
    const isBreakCompleted = activePomodoroIndex > pomodoroIndex ||
      (activePomodoroIndex === pomodoroIndex && phase === "completed");

    const breakColor = isLongBreak ? "bg-blue-500" : "bg-green-500";
    const breakActiveColor = isLongBreak ? "bg-blue-500/70 animate-pulse" : "bg-green-500/70 animate-pulse";

    return (
      <div className="flex-1 h-3 overflow-hidden flex group" title="Click para seleccionar sesión">
        <button
          type="button"
          onClick={() => handleSessionClick(workIndex)}
          className={`flex-1 transition-all cursor-pointer border-slate-300 dark:border-slate-600 ${isLastGroup ? "rounded-md" : "rounded-l-md"} ${isWorkActive ? "bg-primary/70 animate-pulse" :
            isWorkCompleted ? "bg-primary" : "bg-muted hover:bg-muted/80"
            }`}
        />

        {breakPomodoro && (
          <button
            type="button"
            onClick={() => handleSessionClick(breakIndex)}
            className={`flex-1 transition-all cursor-pointer border-slate-300 dark:border-slate-600 ${isLastGroup ? "rounded-r-md" : "rounded-r-md"} ${isBreakActive ? breakActiveColor :
              isBreakCompleted ? breakColor : "bg-muted hover:bg-muted/80"
              }`}
            title={isLongBreak ? "Descanso largo" : "Descanso corto"}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-card rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${phase === "work" ? "border-primary/5 dark:border-primary/10" : phase === "break" ? "border-green-500/40" : "border-primary/5 dark:border-primary/10"
        }`}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold truncate">{task.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {task.startTime && format(new Date(task.startTime), "HH:mm")} - {task.endTime && format(new Date(task.endTime), "HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex flex items-end gap-1">
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${phase === "work" ? "border-primary text-primary" : phase === "break" ? "border-green-500 text-green-500" : ""}`}
            >
              Pomodoro
            </Badge>
          </div>
        </div>

        {pomodoros && pomodoros.length > 0 && (phase === "work" || phase === "break" || phase === "completed") && (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{getPhaseLabel(phase)}</p>
                <p className={`text-4xl font-mono font-bold ${getPhaseColor(phase)} tabular-nums`}>
                  {phase === "completed" ? "00:00" : formatTime(timeRemaining)}
                </p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Sesión</p>
                <p className="text-lg font-mono text-foreground">
                  {completedPomodoros + (phase === "work" ? 1 : 0)} / {totalPomodoros}
                </p>
              </div>
            </div>

            {(phase === "work" || phase === "break") && (
              <div className="flex items-center gap-2">
                <SubtaskSheet
                  task={task}
                  subtasks={task.subtasks!}
                  buttonText={task.subtasks && task.subtasks.length > 0 ? `${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length}` : "-"}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdvance}
                  className="h-6 px-2 text-xs text-muted-foreground border-primary/30 hover:bg-primary/10"
                >
                  <SkipForward className="h-3 w-3 mr-1" />
                  Avanzar
                </Button>
              </div>
            )}

            {(phase === "work" || phase === "break") && currentTip && (
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                <Lightbulb className={`h-4 w-4 shrink-0 ${phase === "work" ? "text-primary" : "text-green-500"}`} />
                <p className="text-xs text-muted-foreground leading-relaxed">{currentTip}</p>
              </div>
            )}

            <div className="flex gap-1.5">
              {Array.from({ length: totalPomodoros }).map((_, i) =>
                renderPomodoroBar(i)
              )}
            </div>
          </div>
        )}

        {phase === "completed" && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              ¡Todas las sesiones completadas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export type { TaskPomodoroProps };
