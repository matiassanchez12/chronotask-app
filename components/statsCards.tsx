"use client";

import { useMemo } from "react";
import { CheckCircle2, Calendar, Target, MinusCircle } from "lucide-react";
import StatCard from "./statCard";

interface Task {
  id: string;
  title: string;
  dueDate: Date | string;
  startTime: Date | string | null;
  endTime: Date | string | null;
  priority: string;
  completed: boolean;
  workTimeMinutes: number | null;
  breakTimeMinutes: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId?: string;
}

interface StatsCardsProps {
  tasks: Task[];
}

export default function StatsCards({ tasks }: StatsCardsProps) {
  const isTaskInProgress = (task: Task) => {
    if (!task.startTime || !task.endTime) return false;
    const now = new Date();
    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    return now >= start && now <= end && !task.completed;
  };

  const stats = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.completed).length;
    const todayTasks = tasks.filter(isTaskInProgress).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const weeklyGoal = 20;
    const weeklyProgress = Math.min(completedTasks, weeklyGoal);

    return {
      completedTasks,
      weeklyGoal,
      weeklyProgress,
      todayTasks,
      pendingTasks,
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title="Completadas"
        value={String(stats.completedTasks)}
        icon={<CheckCircle2 className="h-4 w-4" />}
        variant="green"
      />
      <StatCard
        title="Meta Semanal"
        value={`${stats.weeklyProgress}/${stats.weeklyGoal}`}
        icon={<Calendar className="h-4 w-4" />}
        variant="green"
      />
      <StatCard
        title="Todas"
        value={`${tasks.length}`}
        icon={<Target className="h-4 w-4" />}
        variant="green"
      />
      <StatCard
        title="Pendientes"
        value={`${stats.pendingTasks}`}
        icon={<MinusCircle className="h-4 w-4" />}
        variant="green"
      />
    </div>
  );
}
