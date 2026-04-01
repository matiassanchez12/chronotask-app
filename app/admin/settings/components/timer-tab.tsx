"use client";

import { Clock, Coffee, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TimerTabProps {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  saving: boolean;
  onPomodoroChange: (value: number) => void;
  onShortBreakChange: (value: number) => void;
  onLongBreakChange: (value: number) => void;
  onSave: () => void;
}

const TimerField = ({
  icon: Icon,
  label,
  value,
  onChange,
  min,
  max,
  unit
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
}) => (
  <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
    <div className="p-3 rounded-xl bg-background shadow-sm">
      <Icon className="h-5 w-5 text-foreground" />
    </div>
    <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 h-12 text-center font-bold text-lg rounded-xl"
      />
      <span className="text-sm text-muted-foreground">{unit}</span>
    </div>
  </div>
);

export function TimerTab({
  pomodoro,
  shortBreak,
  longBreak,
  saving,
  onPomodoroChange,
  onShortBreakChange,
  onLongBreakChange,
  onSave,
}: TimerTabProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Temporizador</h2>
        <p className="text-muted-foreground">Configura los tiempos de trabajo y descanso</p>
      </div>

      <Card className="rounded-2xl border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Duración de sesiones</CardTitle>
          <CardDescription>Define cuánto dura cada fase del temporizador Pomodoro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <TimerField
              icon={Clock}
              label="Trabajo"
              value={pomodoro}
              onChange={onPomodoroChange}
              min={1}
              max={120}
              unit="min"
            />
            <TimerField
              icon={Coffee}
              label="Descanso corto"
              value={shortBreak}
              onChange={onShortBreakChange}
              min={1}
              max={30}
              unit="min"
            />
            <TimerField
              icon={Moon}
              label="Descanso largo"
              value={longBreak}
              onChange={onLongBreakChange}
              min={1}
              max={60}
              unit="min"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={onSave} disabled={saving} className="rounded-xl px-6">
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
