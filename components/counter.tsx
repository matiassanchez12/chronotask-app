"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Task } from "@/generated/prisma/client";
import { format } from "date-fns";
import { PlayCircle, Coffee, CheckCircle2, SkipForward } from "lucide-react";
import { completeTask } from "@/app/actions/completeTask";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PomodoroSettings {
  pomodoroDuration?: number;
  shortBreakDuration?: number;
  longBreakDuration?: number;
}

type Phase = "idle" | "work" | "break" | "completed";

interface Pomodoro {
  start: Date;
  end: Date;
}

interface TaskWithPomodoros extends Task {
  pomodoros: Pomodoro[];
}

function calculateTaskPomodoros(
  task: Task, 
  pomodoroDuration: number, 
  shortBreakDuration: number,
  longBreakDuration: number = 15
): Pomodoro[] {
  if (!task.startTime || !task.endTime) return [];
  
  const taskStart = new Date(task.startTime);
  const taskEnd = new Date(task.endTime);
  const taskDuration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60);
  
  const fullPomodoros = Math.floor(taskDuration / pomodoroDuration);
  const remainingMinutes = taskDuration % pomodoroDuration;
  
  const pomodoros: Pomodoro[] = [];
  let currentStart = taskStart;
  
  for (let i = 0; i < fullPomodoros; i++) {
    const pomodoroEnd = new Date(currentStart.getTime() + pomodoroDuration * 60 * 1000);
    pomodoros.push({ start: currentStart, end: pomodoroEnd });
    
    if (i < fullPomodoros - 1 || remainingMinutes > 0) {
      const isLongBreak = (i + 1) % 4 === 0;
      const breakDuration = isLongBreak ? longBreakDuration : shortBreakDuration;
      const breakEnd = new Date(pomodoroEnd.getTime() + breakDuration * 60 * 1000);
      currentStart = breakEnd;
    }
  }
  
  if (remainingMinutes > 0) {
    const finalPomodoroEnd = new Date(currentStart.getTime() + remainingMinutes * 60 * 1000);
    pomodoros.push({ start: currentStart, end: finalPomodoroEnd });
  }
  
  return pomodoros;
}

function getPhaseColor(phase: Phase): string {
  switch (phase) {
    case "work": return "text-primary";
    case "break": return "text-green-500";
    case "completed": return "text-muted-foreground";
    default: return "text-muted-foreground";
  }
}

function getPhaseIcon(phase: Phase) {
  switch (phase) {
    case "work": return <PlayCircle className="h-8 w-8" />;
    case "break": return <Coffee className="h-8 w-8" />;
    case "completed": return <CheckCircle2 className="h-8 w-8" />;
    default: return null;
  }
}

function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case "work": return "Trabajo";
    case "break": return "Descanso";
    case "completed": return "Completado";
    default: return "Esperando";
  }
}

interface CounterTaskProps {
  task: TaskWithPomodoros;
  pomodoroDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

function CounterTask({ task, pomodoroDuration, shortBreakDuration, longBreakDuration }: CounterTaskProps) {
  const [currentPomodoroIndex, setCurrentPomodoroIndex] = useState(0);
  const [secondsInCurrentPhase, setSecondsInCurrentPhase] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [accumulatedTime, setAccumulatedTime] = useState<{ work: number; break: number }>({ work: 0, break: 0 });

  const currentPomodoro = task.pomodoros?.[currentPomodoroIndex];
  const isBreak = currentPomodoroIndex % 2 === 1;
  
  const phaseDurationSeconds = currentPomodoro
    ? (isBreak ? shortBreakDuration * 60 : pomodoroDuration * 60)
    : 0;

  const phase: Phase = !task.pomodoros || task.pomodoros.length === 0 || !currentPomodoro
    ? "idle"
    : secondsInCurrentPhase >= phaseDurationSeconds
    ? (currentPomodoroIndex >= task.pomodoros.length - 1 ? "completed" : "work")
    : isBreak
    ? "break"
    : "work";

  const timeRemaining = currentPomodoro
    ? Math.max(0, phaseDurationSeconds - secondsInCurrentPhase)
    : 0;

  const handleComplete = useCallback(async () => {
    if (isCompleted) return;
    
    setIsCompleted(true);
    const result = await completeTask(task.id, accumulatedTime.work, accumulatedTime.break);
    if (result.success) {
      toast.success("Tarea completada");
    } else {
      toast.error(result.error);
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

    if (currentPomodoroIndex >= task.pomodoros.length - 1) {
      handleComplete();
      return;
    }

    setCurrentPomodoroIndex(prev => prev + 1);
    setSecondsInCurrentPhase(0);
  }, [currentPomodoro, currentPomodoroIndex, phaseDurationSeconds, secondsInCurrentPhase, isBreak, handleComplete, task.pomodoros.length]);

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
    setSecondsInCurrentPhase(0);
  }, [currentPomodoroIndex]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalPomodoros = task.pomodoros ? Math.ceil(task.pomodoros.length / 2) : 0;
  const completedPomodoros = Math.floor((currentPomodoroIndex + 1) / 2);

  const renderPomodoroBar = (pomodoroIndex: number) => {
    const workIndex = pomodoroIndex * 2;
    const breakIndex = workIndex + 1;
    const isCurrentOrPast = pomodoroIndex < currentPomodoroIndex || 
      (pomodoroIndex === currentPomodoroIndex && (phase === "work" || phase === "break"));
    const isBreakPhase = pomodoroIndex % 2 === 1;

    return (
      <div 
        key={pomodoroIndex} 
        className={`flex-1 h-2 rounded-full overflow-hidden flex ${
          pomodoroIndex === currentPomodoroIndex && (phase === "work" || phase === "break") 
            ? isBreakPhase ? "animate-pulse bg-green-500/70" : "animate-pulse bg-primary/70"
            : isCurrentOrPast 
              ? isBreakPhase ? "bg-green-500" : "bg-primary"
              : "bg-muted"
        }`}
      />
    );
  };

  return (
    <div
      className={`bg-card rounded-xl overflow-hidden border-2 transition-all duration-300 ${
        phase === "work" ? "border-primary/50" : phase === "break" ? "border-green-500/50" : "border-border/60"
      }`}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className={`${getPhaseColor(phase)} shrink-0 mt-0.5`}>
            {getPhaseIcon(phase)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{task.title}</h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span>
                {task.startTime && format(new Date(task.startTime), "HH:mm")} - {task.endTime && format(new Date(task.endTime), "HH:mm")}
              </span>
            </div>
          </div>
        </div>

        {task.pomodoros && task.pomodoros.length > 0 && (phase === "work" || phase === "break" || phase === "completed") && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-mono font-bold ${getPhaseColor(phase)}`}>
                {phase === "completed" ? "00:00" : formatTime(timeRemaining)}
              </span>
              <div className="text-sm text-muted-foreground">
                {(phase === "work" || phase === "break") && (
                  <span>
                    Pomodoro {completedPomodoros + (phase === "work" ? 1 : 0)} / {totalPomodoros}
                  </span>
                )}
                {phase === "completed" && (
                  <span>
                    {totalPomodoros} / {totalPomodoros}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getPhaseColor(phase)}`}>
                {getPhaseLabel(phase)}
              </span>
              {(phase === "work" || phase === "break") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdvance}
                  className="h-6 px-2 text-xs"
                >
                  <SkipForward className="h-3 w-3 mr-1" />
                  Avanzar
                </Button>
              )}
            </div>

            <div className="flex gap-1 mt-2">
              {Array.from({ length: totalPomodoros }).map((_, i) => 
                renderPomodoroBar(i)
              )}
            </div>
          </div>
        )}

        {phase === "completed" && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              ¡Todas las sesiones completadas!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Counter({ 
  tasks, 
  pomodoroSettings 
}: { 
  tasks: Task[]; 
  pomodoroSettings?: PomodoroSettings;
}) {
  const pomodoroDuration = pomodoroSettings?.pomodoroDuration ?? 25;
  const shortBreakDuration = pomodoroSettings?.shortBreakDuration ?? 5;
  const longBreakDuration = pomodoroSettings?.longBreakDuration ?? 15;

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.completed) return false;
      if (!task.startTime || !task.endTime) return false;
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      return now >= start && now <= end;
    });
  }, [tasks, now]);

  const tasksWithPomodoros = useMemo((): TaskWithPomodoros[] => {
    return activeTasks.map(task => ({
      ...task,
      pomodoros: calculateTaskPomodoros(task, pomodoroDuration, shortBreakDuration, longBreakDuration)
    }));
  }, [activeTasks, pomodoroDuration, shortBreakDuration, longBreakDuration]);

  if (activeTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">No hay tareas activas en este momento</p>
        <p className="text-muted-foreground text-sm mt-2">Crea una tarea con horario para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasksWithPomodoros.map((task) => (
        <CounterTask
          key={task.id}
          task={task}
          pomodoroDuration={pomodoroDuration}
          shortBreakDuration={shortBreakDuration}
          longBreakDuration={longBreakDuration}
        />
      ))}
    </div>
  );
}
