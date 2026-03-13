"use client";

import { useState, useEffect } from "react";
import Tasks from "@/components/tasks";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocalTasks } from "@/lib/localUser";
import { useSession } from "next-auth/react";

export default function InProgressPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then((data) => {
          const allTasks = data.tasks || [];
          const now = new Date();
          const activeTasks = allTasks.filter((task: any) => {
            if (!task.startTime || !task.endTime) return false;
            const start = new Date(task.startTime);
            const end = new Date(task.endTime);
            return now >= start && now <= end && !task.completed;
          });
          setTasks(activeTasks);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      const allTasks = getLocalTasks();
      const now = new Date();
      const activeTasks = allTasks.filter((task) => {
        if (!task.startTime || !task.endTime) return false;
        const start = new Date(task.startTime);
        const end = new Date(task.endTime);
        return now >= start && now <= end && !task.completed;
      });
      setTasks(activeTasks);
      setLoading(false);
    }
  }, [session]);

  const pomodoroSettings = {
    pomodoroDuration: 25,
    shortBreakDuration: 5,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link 
          href="/admin" 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <h1 className="text-3xl font-bold">Tareas en Proceso</h1>
        <p className="text-muted-foreground mt-1">Gestiona tus sesiones de trabajo</p>
      </div>
      <Tasks tasks={tasks} mode="counter" pomodoroSettings={pomodoroSettings} />
    </div>
  );
}
