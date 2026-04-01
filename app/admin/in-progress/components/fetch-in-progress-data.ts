import { getTasks, getUserSettings } from "@/app/actions";
import { Task, UserSettings } from "@/generated/prisma/client";

export type InProgressData = {
  tasks: Task[];
  pomodoroSettings: UserSettings | null;
};

export async function fetchInProgressData(): Promise<InProgressData> {
  const [tasks, pomodoroSettings] = await Promise.all([
    getTasks('active'),
    getUserSettings(),
  ]);

  return { tasks, pomodoroSettings };
}
