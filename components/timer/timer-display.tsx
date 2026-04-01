"use client";

import { Phase, TimerMode, formatDuration, getPhaseLabel } from "@/lib/pomodoro";

interface TimerDisplayProps {
  timeRemaining: number;
  elapsed: number;
  phase: Phase;
  isLowTime: boolean;
  mode: TimerMode;
  currentSession: number;
  totalSessions: number;
}

export function TimerDisplay({
  timeRemaining,
  elapsed,
  phase,
  isLowTime,
  mode,
  currentSession,
  totalSessions,
}: TimerDisplayProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {mode === "timer" ? "Restante" : getPhaseLabel(phase)}
        </p>
        <p
          className={`text-4xl font-mono font-bold tabular-nums ${
            phase === "break" ? "text-green-500" : "text-primary"
          } ${isLowTime ? "animate-pulse" : ""}`}
        >
          {formatDuration(timeRemaining * 1000)}
        </p>
      </div>

      <div className="text-right space-y-1">
        {mode === "timer" ? (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Transcurrido</p>
            <p className="text-lg font-mono text-foreground tabular-nums">
              {formatDuration(elapsed * 1000)}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Sesión</p>
            <p className="text-lg font-mono text-foreground">
              {currentSession + 1} / {totalSessions}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
