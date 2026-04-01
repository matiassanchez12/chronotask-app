import { TimerCard } from "@/components/timer/timer-card";
import { Task, UserSettings } from "@/generated/prisma/client";
import { completeTask } from "@/app/actions/completeTask";

interface InProgressContentProps {
  data: {
    tasks: Task[];
    pomodoroSettings: UserSettings | null;
  };
}

export function InProgressContent({ data }: InProgressContentProps) {
  const { tasks, pomodoroSettings } = data;

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">¡Todas las tareas fueron completadas!</p>
        <p className="text-muted-foreground text-sm mt-2">Crea una tarea con horario para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TimerCard
          key={task.id}
          task={task}
          mode={task.usePomodoro ? "pomodoro" : "timer"}
          durations={
            task.usePomodoro
              ? {
                  work: pomodoroSettings?.pomodoroDuration || 25,
                  shortBreak: pomodoroSettings?.shortBreakDuration || 5,
                  longBreak: pomodoroSettings?.longBreakDuration || 15,
                }
              : undefined
          }
          onComplete={completeTask}
        />
      ))}
    </div>
  );
}
