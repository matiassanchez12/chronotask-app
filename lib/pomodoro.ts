import { Task } from "@/generated/prisma/client";

export type Phase = "idle" | "work" | "break" | "completed";

export type TimerMode = "pomodoro" | "timer";

export interface Session {
  start: Date;
  end: Date;
  type: "work" | "shortBreak" | "longBreak";
}

export interface PomodoroSession {
  workStart: Date;
  workEnd: Date;
  breakStart?: Date;
  breakEnd?: Date;
  hasBreak: boolean;
}

export interface Durations {
  work: number;
  shortBreak: number;
  longBreak: number;
}

export function calculateTimerSessions(
  task: Task,
  durations: Durations
): PomodoroSession[] {
  if (!task.startTime || !task.endTime) return [];

  const taskStart = new Date(task.startTime);
  const taskEnd = new Date(task.endTime);
  const taskDuration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60);

  if (taskDuration <= 0) return [];

  const pomodoroSessions: PomodoroSession[] = [];
  let currentStart = taskStart;

  const workDuration = durations.work;
  const breakDuration = durations.shortBreak;
  const sessionDuration = workDuration + breakDuration;
  const numSessions = Math.floor(taskDuration / sessionDuration);

  for (let i = 0; i < numSessions; i++) {
    const workStart = currentStart;
    const workEnd = new Date(workStart.getTime() + workDuration * 60 * 1000);
    
    const breakStart = new Date(workEnd.getTime());
    const breakEnd = new Date(breakStart.getTime() + breakDuration * 60 * 1000);
    
    const exceedsTask = breakEnd > taskEnd;
    
    pomodoroSessions.push({
      workStart,
      workEnd,
      breakStart: exceedsTask ? undefined : breakStart,
      breakEnd: exceedsTask ? undefined : breakEnd,
      hasBreak: !exceedsTask,
    });
    
    currentStart = breakEnd;
  }

  return pomodoroSessions;
}

export function calculateTimerSession(task: Task): Session[] {
  if (!task.startTime || !task.endTime) return [];

  const start = new Date(task.startTime);
  const end = new Date(task.endTime);

  return [{ start, end, type: "work" }];
}

export function getPomodoroPhase(
  sessions: PomodoroSession[],
  sessionIndex: number,
  now: Date
): Phase {
  if (!sessions.length) return "idle";

  const session = sessions[sessionIndex];
  if (!session) return "completed";

  if (now >= session.workStart && now < session.workEnd) {
    return "work";
  }

  if (session.hasBreak && session.breakStart && session.breakEnd) {
    if (now >= session.breakStart && now < session.breakEnd) {
      return "break";
    }
  }

  if (now >= session.workEnd) {
    if (sessionIndex >= sessions.length - 1) return "completed";
    const nextSession = sessions[sessionIndex + 1];
    if (nextSession && now >= nextSession.workStart) {
      return "work";
    }
    return "idle";
  }

  return "idle";
}

export function getPhaseFromSessions(
  sessions: Session[],
  sessionIndex: number,
  now: Date
): Phase {
  if (!sessions.length) return "idle";

  const session = sessions[sessionIndex];
  if (!session) return "completed";

  if (now >= session.start && now < session.end) {
    return session.type === "work" ? "work" : "break";
  }

  if (now >= session.end) {
    if (sessionIndex >= sessions.length - 1) return "completed";
    return sessions[sessionIndex + 1].type === "work" ? "work" : "break";
  }

  return "idle";
}

export function getTimerPhase(task: Task, now: Date): Phase {
  if (!task.startTime || !task.endTime) return "idle";

  const end = new Date(task.endTime);
  return now >= end ? "completed" : "work";
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getPhaseStyles(phase: Phase): string {
  switch (phase) {
    case "work":
      return "border-primary/5 dark:border-primary/10";
    case "break":
      return "border-green-500/40";
    case "completed":
      return "border-primary/5 dark:border-primary/10";
    default:
      return "border-border";
  }
}

export function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case "work":
      return "Trabajo";
    case "break":
      return "Descanso";
    case "completed":
      return "Completado";
    default:
      return "Esperando";
  }
}
