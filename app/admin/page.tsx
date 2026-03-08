import Filters from "@/components/filters";
import Header from "@/components/header";
import ModeToggle from "@/components/modeToggle";
import Tasks from "@/components/tasks";
import { prisma } from "@/lib/prisma";
import { getDateRange } from "@/lib/dateFilters";
import { getServerSession } from "next-auth";
import { getUserSettings } from "@/app/actions/settings";

interface HomeProps {
  searchParams: Promise<{ filter?: string; mode?: string }>;
}

export default async function Home({
  searchParams,
}: HomeProps) {
  const params = await searchParams;
  const session = await getServerSession();
  const userId = session?.user?.id;
  const filter = params?.filter ?? "today";
  const range = getDateRange(filter);

  const allTasks = await prisma.task.findMany({
    where: {
      userId: userId,
    },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();
  const hasActiveTasks = allTasks.some(task => {
    if (!task.startTime || !task.endTime) return false;
    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    return now >= start && now <= end;
  });

  const mode = params?.mode 
    ? params.mode 
    : (hasActiveTasks ? "counter" : "todo");

  const tasks = mode === "todo" 
    ? allTasks.filter(task => {
        if (!range) return true;
        const dueDate = new Date(task.dueDate);
        return dueDate >= range.from && dueDate <= range.to;
      })
    : allTasks;

  const settings = await getUserSettings();
  const pomodoroSettings = {
    pomodoroDuration: settings?.pomodoroDuration ?? 25,
    shortBreakDuration: settings?.shortBreakDuration ?? 5,
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <div className="flex justify-end mb-4">
          <ModeToggle filter={filter} mode={mode} hasActiveTasks={hasActiveTasks} />
        </div>
        {mode !== "counter" && <Filters />}
        <Tasks tasks={tasks} mode={mode} pomodoroSettings={pomodoroSettings} />
      </div>
    </div>
  );
}
