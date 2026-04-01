import { Task } from "@/generated/prisma/browser";

export interface ActiveTask {
  id: string;
  title: string;
}

export function findActiveTasks(tasks: Task[]): ActiveTask[] {
  return tasks
    .filter((task: Task) => {
      if (!task.startTime || !task.endTime) return false;
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const now = new Date();
      return now >= start && now <= end && !task.completed;
    })
    .map((task: Task) => ({ id: task.id, title: task.title }));
}

export function findNextWeekTasks(tasks: Task[]): Task[] {
  return tasks.filter((task: Task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7);
    const nextSaturday = new Date(nextSunday);
    nextSaturday.setDate(nextSunday.getDate() + 6);

    return dueDate >= nextSunday && dueDate <= nextSaturday && !task.completed;
  });
}

export function isTaskInProgress(task: Task): boolean {
  if (!task.startTime || !task.endTime) return false;
  const now = new Date();
  const start = new Date(task.startTime);
  const end = new Date(task.endTime);
  return now >= start && now <= end && !task.completed;
}
