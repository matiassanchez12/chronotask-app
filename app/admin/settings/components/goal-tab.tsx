"use client";

import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GoalTabProps {
  weeklyGoal: number;
  saving: boolean;
  onGoalChange: (value: number) => void;
  onSave: () => void;
}

const goalPresets = [5, 10, 15, 20, 25, 30, 40, 50];

export function GoalTab({ weeklyGoal, saving, onGoalChange, onSave }: GoalTabProps) {
  const progress = (weeklyGoal / 50) * 100;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Meta semanal</h2>
        <p className="text-muted-foreground">Define cuántas tareas quieres completar esta semana</p>
      </div>

      <Card className="rounded-2xl border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objetivo de tareas
          </CardTitle>
          <CardDescription>Arrastra el slider o selecciona un número</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center py-4">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full bg-muted/50 flex items-center justify-center">
                <div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center shadow-inner"
                  style={{
                    background: `conic-gradient(var(--primary) ${progress * 3.6}deg, var(--muted) 0deg)`
                  }}
                >
                  <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                    <span className="text-5xl font-bold">{weeklyGoal}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">tareas por semana</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="range"
                min={1}
                max={50}
                value={weeklyGoal}
                onChange={(e) => onGoalChange(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer bg-muted"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${progress}%, var(--muted) ${progress}%, var(--muted) 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>1</span>
              <span>50</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {goalPresets.map((value) => (
              <button
                key={value}
                onClick={() => onGoalChange(value)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  weeklyGoal === value
                    ? "bg-foreground text-background shadow-md scale-105"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Button onClick={onSave} disabled={saving} className="rounded-xl px-8">
              {saving ? "Guardando..." : "Guardar meta"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
