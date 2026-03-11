"use client";

import { useMemo } from "react";
import { CheckCircle2, Clock, CupSoda, Flame, Target, AlertCircle, Calendar, Zap } from "lucide-react";
import StatCard from "./statCard";

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  startTime: Date | null;
  endTime: Date | null;
  priority: string;
  completed: boolean;
  workTimeMinutes: number | null;
  breakTimeMinutes: number | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface StatsCardsProps {
  tasks: Task[];
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export default function StatsCards({ tasks }: StatsCardsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayTasks = tasks;

    const completedToday = todayTasks.filter((task) => task.completed).length;
    const pendingToday = todayTasks.filter((task) => !task.completed).length;
    const progress =
      todayTasks.length > 0
        ? Math.round((completedToday / todayTasks.length) * 100)
        : 0;

    const overdueTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate < today && !task.completed;
    }).length;

    const todayWorkMinutes = todayTasks
      .filter((task) => task.completed && task.workTimeMinutes)
      .reduce((sum, task) => sum + (task.workTimeMinutes || 0), 0);

    const todayBreakMinutes = todayTasks
      .filter((task) => task.completed && task.breakTimeMinutes)
      .reduce((sum, task) => sum + (task.breakTimeMinutes || 0), 0);

    const yesterdayTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate >= yesterday && dueDate < today && task.completed;
    });
    const completedYesterday = yesterdayTasks.length;
    const streak = completedYesterday > 0 && completedToday > 0 ? 1 : 0;

    const totalWorkMinutes = tasks
      .filter((task) => task.completed && task.workTimeMinutes)
      .reduce((sum, task) => sum + (task.workTimeMinutes || 0), 0);

    const totalBreakMinutes = tasks
      .filter((task) => task.completed && task.breakTimeMinutes)
      .reduce((sum, task) => sum + (task.breakTimeMinutes || 0), 0);

    const completedTasks = tasks.filter((task) => task.completed).length;
    const weeklyGoal = 20;
    const weeklyProgress = Math.min(completedTasks, weeklyGoal);

    return {
      completedToday,
      pendingToday,
      totalToday: todayTasks.length,
      progress,
      todayWorkMinutes,
      todayBreakMinutes,
      overdueTasks,
      streak,
      totalWorkMinutes,
      totalBreakMinutes,
      completedTasks,
      weeklyGoal,
      weeklyProgress,
    };
  }, [tasks]);

  return (
    <div className="grid grid-cols-2 sm:3 md:4 lg:6 gap-3">
      <StatCard
        title="Progreso"
        value={`${stats.progress}%`}
        icon={<Target className="h-4 w-4" />}
        variant="cyan"
      />
      <StatCard
        title="Completadas"
        value={String(stats.completedToday)}
        icon={<CheckCircle2 className="h-4 w-4" />}
        variant="green"
      />
      <StatCard
        title="Pendientes"
        value={String(stats.pendingToday)}
        icon={<AlertCircle className="h-4 w-4" />}
        variant="amber"
      />
      <StatCard
        title="Vencidas"
        value={String(stats.overdueTasks)}
        icon={<Flame className="h-4 w-4" />}
        variant="rose"
      />
      <StatCard
        title="Trabajo Hoy"
        value={formatMinutes(stats.todayWorkMinutes)}
        icon={<Clock className="h-4 w-4" />}
        variant="cyan"
      />
      <StatCard
        title="Descanso Hoy"
        value={formatMinutes(stats.todayBreakMinutes)}
        icon={<CupSoda className="h-4 w-4" />}
        variant="violet"
      />
      <StatCard
        title="Racha"
        value={`${stats.streak}d`}
        icon={<Zap className="h-4 w-4" />}
        variant="amber"
      />
      <StatCard
        title="Meta Semanal"
        value={`${stats.weeklyProgress}/${stats.weeklyGoal}`}
        icon={<Calendar className="h-4 w-4" />}
        variant="green"
      />
    </div>
  );
}
