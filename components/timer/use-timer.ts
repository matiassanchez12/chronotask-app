"use client";

import { useState, useEffect, useMemo } from "react";
import {
  calculateTimerSessions,
  calculateTimerSession,
  getPomodoroPhase,
  getTimerPhase,
  Phase,
  TimerMode,
  Session,
  Durations,
  PomodoroSession,
} from "@/lib/pomodoro";
import { Task, Subtask } from "@/generated/prisma/client";

interface TaskWithSubtasks extends Task {
  subtasks?: Subtask[];
}

interface TimerState {
  sessionIndex: number;
  accumulated: { work: number; break: number };
}

interface UseTimerOptions {
  task: TaskWithSubtasks;
  mode: TimerMode;
  durations?: Durations;
  onComplete: (taskId: string, workMinutes: number, breakMinutes: number) => void;
}

const STORAGE_PREFIX = "timer-";

function getStorageKey(taskId: string, mode: TimerMode): string {
  return `${STORAGE_PREFIX}${mode}-${taskId}`;
}

function loadState(taskId: string, mode: TimerMode): TimerState {
  if (typeof window === "undefined") {
    return { sessionIndex: 0, accumulated: { work: 0, break: 0 } };
  }

  try {
    const stored = localStorage.getItem(getStorageKey(taskId, mode));
    return stored
      ? JSON.parse(stored)
      : { sessionIndex: 0, accumulated: { work: 0, break: 0 } };
  } catch {
    return { sessionIndex: 0, accumulated: { work: 0, break: 0 } };
  }
}

function saveState(taskId: string, mode: TimerMode, state: TimerState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getStorageKey(taskId, mode), JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function useTimer({
  task,
  mode,
  durations,
  onComplete,
}: UseTimerOptions) {
  const [now, setNow] = useState(() => new Date());
  const [savedState, setSavedState] = useState<TimerState>(() =>
    loadState(task.id, mode)
  );

  const sessions = useMemo((): PomodoroSession[] => {
    if (mode === "timer") {
      const timerSession = calculateTimerSession(task);
      if (!timerSession.length) return [];
      return [{
        workStart: timerSession[0].start,
        workEnd: timerSession[0].end,
        hasBreak: false,
      }];
    }
    return durations
      ? calculateTimerSessions(task, durations)
      : [];
  }, [task, mode, durations]);

  const currentSessionIndex = useMemo(() => {
    if (!sessions.length) return 0;
    const idx = savedState.sessionIndex;
    if (idx >= sessions.length) return sessions.length - 1;

    const session = sessions[idx];
    if (!session) return idx;

    if (mode === "pomodoro" || mode === "timer") {
      if (session.hasBreak && session.breakEnd && now >= session.breakEnd) {
        if (idx + 1 < sessions.length) {
          return idx + 1;
        }
        return idx;
      }
      if (now >= session.workEnd) {
        if (session.hasBreak && session.breakEnd && now < session.breakEnd) {
          return idx;
        }
        if (idx + 1 < sessions.length) {
          return idx + 1;
        }
        return idx;
      }
    }
    return idx;
  }, [sessions, savedState.sessionIndex, now, mode]);

  const currentSession = sessions[currentSessionIndex];

  useEffect(() => {
    if (!sessions.length) return;

    if (currentSessionIndex !== savedState.sessionIndex) {
      setSavedState(prev => ({ ...prev, sessionIndex: currentSessionIndex }));
    }
  }, [currentSessionIndex, savedState.sessionIndex, sessions.length]);

  const phase = useMemo((): Phase => {
    if (mode === "timer") {
      return getTimerPhase(task, now);
    }

    return getPomodoroPhase(sessions, currentSessionIndex, now);
  }, [mode, task, now, sessions, currentSessionIndex]);

  const timeRemaining = useMemo((): number => {
    if (mode === "timer") {
      if (!task.endTime) return 0;
      return Math.max(
        0,
        Math.floor(
          (new Date(task.endTime).getTime() - now.getTime()) / 1000
        )
      );
    }

    if (!currentSession) return 0;

    if (phase === "work") {
      return Math.max(
        0,
        Math.floor((currentSession.workEnd.getTime() - now.getTime()) / 1000)
      );
    }

    if (phase === "break" && currentSession.breakEnd) {
      return Math.max(
        0,
        Math.floor((currentSession.breakEnd.getTime() - now.getTime()) / 1000)
      );
    }

    return 0;
  }, [mode, task.endTime, currentSession, phase, now]);

  const elapsed = useMemo((): number => {
    if (!task.startTime) return 0;
    return Math.floor(
      (now.getTime() - new Date(task.startTime).getTime()) / 1000
    );
  }, [task.startTime, now]);

  const progress = useMemo((): number => {
    if (!task.startTime || !task.endTime) return 0;
    const total = new Date(task.endTime).getTime() - new Date(task.startTime).getTime();
    const totalSeconds = total / 1000;
    return totalSeconds > 0 ? Math.min(100, (elapsed / totalSeconds) * 100) : 0;
  }, [task.startTime, task.endTime, elapsed]);

  const isLowTime = timeRemaining > 0 && timeRemaining <= 300;

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveState(task.id, mode, savedState);
  }, [task.id, mode, savedState]);

  useEffect(() => {
    if (phase === "completed") {
      onComplete(task.id, Math.floor(elapsed / 60), 0);
    }
  }, [phase, onComplete, task.id, elapsed]);

  const completedSubtasks = useMemo(() => {
    return task.subtasks?.filter((s) => s.completed).length ?? 0;
  }, [task.subtasks]);

  return {
    phase,
    timeRemaining,
    elapsed,
    progress,
    sessions,
    currentSessionIndex,
    totalSessions: sessions.length,
    isLowTime,
    completedSubtasks,
    totalSubtasks: task.subtasks?.length ?? 0,
  };
}

export type { TimerMode, TimerState };
