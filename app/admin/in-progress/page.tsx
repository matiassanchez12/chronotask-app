import Header from "@/components/header";
import Tasks from "@/components/tasks";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { getUserSettings } from "@/app/actions/settings";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function InProgressPage() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  const allTasks = await prisma.task.findMany({
    where: {
      userId: userId,
    },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();
  const activeTasks = allTasks.filter(task => {
    if (!task.startTime || !task.endTime) return false;
    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    return now >= start && now <= end && !task.completed;
  });

  const settings = await getUserSettings();
  const pomodoroSettings = {
    pomodoroDuration: settings?.pomodoroDuration ?? 25,
    shortBreakDuration: settings?.shortBreakDuration ?? 5,
  };

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
      <Tasks tasks={activeTasks} mode="counter" pomodoroSettings={pomodoroSettings} />
    </div>
  );
}
