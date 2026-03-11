import TaskCard from "./taskCard";
import Counter from "./counter";
import { Task } from "@/generated/prisma/client";

interface PomodoroSettings {
  pomodoroDuration: number;
  shortBreakDuration: number;
}

interface TasksProps {
  tasks: Task[];
  mode?: string;
  pomodoroSettings?: PomodoroSettings;
}

export default function Tasks({ tasks, mode, pomodoroSettings }: TasksProps) {
  if (mode === "counter") {
    return <Counter tasks={tasks} pomodoroSettings={pomodoroSettings} />;
  }

  return (
    <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 pb-8">
      {tasks.length === 0 && (
        <p className="text-muted-foreground text-sm">No hay tareas en este rango.</p>
      )}

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
