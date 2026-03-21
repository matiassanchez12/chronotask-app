import { getTasks, getUserSettings } from "@/app/actions";
import Header from "@/components/header";
import TaskPomodoro from "@/components/task-pomodoro";
import TaskTimer from "@/components/task-timer";

export default async function InProgressPage() {
  const tasks = await getTasks('active');
  const pomodoroSettings = await getUserSettings();

  return (
    <div className="space-y-6">
      <Header title="En Progreso" subTitle="Gestiona tus sesiones de trabajo" />
      <div className="space-y-4">
        {tasks.length === 0 &&
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground text-lg">No hay nada para hacer ahora</p>
            <p className="text-muted-foreground text-sm mt-2">Crea una tarea con horario para comenzar</p>
          </div>
        }

        {tasks.map((task) => (
          task.usePomodoro ? (
            <TaskPomodoro
              key={task.id}
              task={task}
              pomodoroDuration={pomodoroSettings?.pomodoroDuration || 25}
              shortBreakDuration={pomodoroSettings?.shortBreakDuration || 25}
              longBreakDuration={pomodoroSettings?.longBreakDuration || 25}
            />
          ) : (
            <TaskTimer
              key={task.id}
              task={task}
            />
          )
        ))}
      </div>
    </div>
  );
}
