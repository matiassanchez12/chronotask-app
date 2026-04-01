import { getTasks, getUserSettings } from "@/app/actions";
import { Task } from "@/generated/prisma/client";

export type DashboardData = {
  tasks: Task[];
  weeklyGoal: number;
};

export async function fetchDashboardData(): Promise<DashboardData> {
  const [tasks, settings] = await Promise.all([
    getTasks(),
    getUserSettings(),
  ]);

  return {
    tasks,
    weeklyGoal: settings?.weeklyGoal ?? 20,
  };
}
