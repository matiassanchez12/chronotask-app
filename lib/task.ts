import { Task } from "@/generated/prisma/client";

export interface Pomodoro {
  start: Date;
  end: Date;
  isLongBreak?: boolean;
}

export type Phase = "idle" | "work" | "break" | "completed";

export function calculateTaskPomodoros(
  task: Task,
  pomodoroDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number = 15,
  currentTime?: Date
): Pomodoro[] {
  if (!task.startTime || !task.endTime) return [];

  const taskStart = new Date(task.startTime);
  const taskEnd = new Date(task.endTime);
  const effectiveStart = currentTime && currentTime > taskStart ? currentTime : taskStart;
  const taskDuration = (taskEnd.getTime() - effectiveStart.getTime()) / (1000 * 60);

  if (taskDuration <= 0) return [];

  const pomodoros: Pomodoro[] = [];
  let currentStart = effectiveStart;

  const fullPomodoros = Math.floor(taskDuration / pomodoroDuration);
  const remainingMinutes = taskDuration % pomodoroDuration;

  for (let i = 0; i < fullPomodoros; i++) {
    pomodoros.push({
      start: currentStart,
      end: new Date(currentStart.getTime() + pomodoroDuration * 60 * 1000)
    });

    if (i < fullPomodoros - 1) {
      const isLongBreak = (i + 1) % 4 === 0;
      const breakDuration = isLongBreak ? longBreakDuration : shortBreakDuration;
      const breakEnd = new Date(pomodoros[pomodoros.length - 1].end.getTime() + breakDuration * 60 * 1000);
      pomodoros.push({
        start: pomodoros[pomodoros.length - 1].end,
        end: breakEnd,
        isLongBreak
      });
      currentStart = breakEnd;
    }
  }

  if (remainingMinutes > 0) {
    const lastPomodoro = pomodoros.findLast(p => !p.isLongBreak);
    if (lastPomodoro) {
      lastPomodoro.end = new Date(lastPomodoro.end.getTime() + remainingMinutes * 60 * 1000);
    } else {
      pomodoros.push({
        start: currentStart,
        end: new Date(currentStart.getTime() + remainingMinutes * 60 * 1000)
      });
    }
  }

  return pomodoros;
}

export function getPhaseColor(phase: Phase): string {
  switch (phase) {
    case "work": return "text-primary";
    case "break": return "text-green-500";
    case "completed": return "text-muted-foreground";
    default: return "text-muted-foreground";
  }
}

export function getPhaseIcon(phase: Phase): React.ReactNode {
  return null;
}

export function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case "work": return "Trabajo";
    case "break": return "Descanso";
    case "completed": return "Completado";
    default: return "Esperando";
  }
}

export function getActiveSessionInfo(pomodoros: Pomodoro[], now: Date) {
  for (let i = 0; i < pomodoros.length; i++) {
    if (now >= pomodoros[i].start && now < pomodoros[i].end) {
      return {
        sessionIndex: i,
        secondsElapsed: Math.floor((now.getTime() - pomodoros[i].start.getTime()) / 1000),
      };
    }
  }
  for (let i = pomodoros.length - 1; i >= 0; i--) {
    if (now >= pomodoros[i].start) {
      return { sessionIndex: i, secondsElapsed: 0 };
    }
  }
  return { sessionIndex: 0, secondsElapsed: 0 };
}

export const workTips = [
  "Enfócate en una sola tarea a la vez",
  "Escribe el siguiente paso antes de continuar",
  "Elimina distracciones digitales",
  "Mantén la mente clara, toma notas si algo surge",
  "Trabaja en el problema más difícil primero",
  "Si te atascas, escribe qué te bloquea",
  "Mantén tu postura erguida y respira profundo",
];

export const breakTips = [
  "Levántate y estírate por 30 segundos",
  "Mira algo a 6 metros de distancia por 20 segundos",
  "Hidratate: bebe un vaso de agua",
  "Camina un poco por la habitación",
  "Cierra los ojos y respira profundo 5 veces",
  "Revisa tu postura y ajusta tu posición",
];
