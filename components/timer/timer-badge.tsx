"use client";

import { Badge } from "@/components/ui/badge";
import { TimerMode, Phase } from "@/lib/pomodoro";

interface TimerBadgeProps {
  mode: TimerMode;
  phase: Phase;
}

export function TimerBadge({ mode, phase }: TimerBadgeProps) {
  const label = mode === "pomodoro" 
    ? (phase === "break" ? "Descanso" : "Pomodoro")
    : "Timer";

  const className = mode === "pomodoro" && phase === "break"
    ? "border-green-500 text-green-500"
    : "";

  return (
    <Badge variant="outline" className={`text-xs shrink-0 ${className}`}>
      {label}
    </Badge>
  );
}
