import { getTasks } from "@/app/actions";
import Tasks from "@/components/tasks";
import Header from "@/components/header";

export default async function InProgressPage() {
  const tasks = await getTasks('today');

  return (
    <div className="space-y-6">
      <Header title="Tareas en Progreso" subTitle="Gestiona tus sesiones de trabajo" />
      <Tasks tasks={tasks} mode="counter" pomodoroSettings={{ pomodoroDuration: 25, shortBreakDuration: 5 }} />
    </div>
  );
}
