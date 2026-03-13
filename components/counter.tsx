"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Task } from "@/generated/prisma/client";
import { format } from "date-fns";
import { Laptop, Coffee, CheckCircle2, SkipForward, Clock } from "lucide-react";
import { completeTask as serverCompleteTask } from "@/app/actions/completeTask";
import { updateLocalTask } from "@/lib/localUser";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    case "work": return <Laptop className="h-8 w-8" />;
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
    
    const isLocal = task.id.startsWith("local-");
    let success = false;
    
    if (isLocal) {
      const result = updateLocalTask(task.id, {
        completed: true,
        workTimeMinutes: accumulatedTime.work || 0,
        breakTimeMinutes: accumulatedTime.break || 0
      });
      success = !!result;
    } else {
      const result = await serverCompleteTask(task.id, accumulatedTime.work, accumulatedTime.break);
      success = result.success;
    }
    
    if (success) {
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

  const handleSessionClick = useCallback((index: number) => {
    setCurrentPomodoroIndex(index);
    setSecondsInCurrentPhase(0);
  }, []);

  const renderPomodoroBar = (pomodoroIndex: number) => {
    const workIndex = pomodoroIndex * 2;
    const breakIndex = workIndex + 1;
    const workPomodoro = task.pomodoros?.[workIndex];
    const breakPomodoro = task.pomodoros?.[breakIndex];

    if (!workPomodoro) return null;

    const activePomodoroIndex = Math.floor(currentPomodoroIndex / 2);

    const isWorkActive = activePomodoroIndex === pomodoroIndex && phase === "work";
    const isWorkCompleted = activePomodoroIndex > pomodoroIndex || 
      (activePomodoroIndex === pomodoroIndex && (phase === "break" || phase === "completed"));

    const isBreakActive = activePomodoroIndex === pomodoroIndex && phase === "break";
    const isBreakCompleted = activePomodoroIndex > pomodoroIndex || 
      (activePomodoroIndex === pomodoroIndex && phase === "completed");

    return (
      <div className="flex-1 h-3 rounded-full overflow-hidden flex group" title="Click para seleccionar sesión">
        <button
          type="button"
          onClick={() => handleSessionClick(workIndex)}
          className={`flex-1 transition-all cursor-pointer ${
            isWorkActive ? "bg-primary/70 animate-pulse" :
            isWorkCompleted ? "bg-primary" : "bg-muted hover:bg-muted/80"
          }`}
        />
        
        {breakPomodoro && (
          <button
            type="button"
            onClick={() => handleSessionClick(breakIndex)}
            className={`flex-1 transition-all cursor-pointer ${
              isBreakActive ? "bg-green-500/70 animate-pulse" :
              isBreakCompleted ? "bg-green-500" : "bg-muted hover:bg-muted/80"
            }`}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className={`bg-card rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${
        phase === "work" ? "border-primary/50" : phase === "break" ? "border-green-500/50" : "border-border/60"
      }`}
    >
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`${getPhaseColor(phase)} shrink-0 mt-0.5`}>
              {getPhaseIcon(phase)}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold truncate">{task.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {task.startTime && format(new Date(task.startTime), "HH:mm")} - {task.endTime && format(new Date(task.endTime), "HH:mm")}
              </p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs shrink-0 ${phase === "work" ? "border-primary text-primary" : phase === "break" ? "border-green-500 text-green-500" : ""}`}
          >
            Pomodoro
          </Badge>
        </div>

        {task.pomodoros && task.pomodoros.length > 0 && (phase === "work" || phase === "break" || phase === "completed") && (
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdvance}
                  className="h-6 px-2 text-xs"
                >
                  <SkipForward className="h-3 w-3 mr-1" />
                  Avanzar
                </Button>
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

interface SimpleTimerTaskProps {
  task: Task;
}

function SimpleTimerTask({ task }: SimpleTimerTaskProps) {
  const [now, setNow] = useState(() => new Date());
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
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
    
    const isLocal = task.id.startsWith("local-");
    let success = false;
    
    if (isLocal) {
      const result = updateLocalTask(task.id, {
        completed: true,
        workTimeMinutes: Math.floor(elapsed / 60000),
        breakTimeMinutes: 0
      });
      success = !!result;
    } else {
      const result = await serverCompleteTask(task.id, Math.floor(elapsed / 60000), 0);
      success = result.success;
    }
    
    if (success) {
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
    <div className="bg-card rounded-xl overflow-hidden border-2 border-primary/50 shadow-sm">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="text-primary shrink-0 mt-0.5">
              <Clock className="h-6 w-6" />
            </div>
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
        task.usePomodoro ? (
          <CounterTask
            key={task.id}
            task={task}
            pomodoroDuration={pomodoroDuration}
            shortBreakDuration={shortBreakDuration}
            longBreakDuration={longBreakDuration}
          />
        ) : (
          <SimpleTimerTask
            key={task.id}
            task={task}
          />
        )
      ))}
    </div>
  );
}
