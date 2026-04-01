import {
  startOfToday,
  endOfToday,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  isSameDay,
} from "date-fns";
import { es } from "date-fns/locale";
import type { Task } from "@/generated/prisma/client";

export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function getWeekDays(from: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(from, i));
}

export function formatColumnDate(date: Date): string {
  const formatted = format(date, "EEEE d", { locale: es });
  const dayNumber = formatted.split(' ')[1];

  return formatted.charAt(0).toUpperCase() + formatted.slice(1, 3) + " " + dayNumber;
}

export function formatDayHeader(date: Date): string {
  const formatted = format(date, "EEEE d", { locale: es });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function groupTasksByDate(tasks: Task[]): Map<string, Task[]> {
  const grouped = new Map<string, Task[]>();
  
  for (const task of tasks) {
    const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd");
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(task);
  }
  
  return grouped;
}

export function getDateRange(filter?: string) {
  const now = new Date();

  switch (filter) {
    case "today":
      return {
        from: startOfToday(),
        to: endOfToday(),
      };

    case "tomorrow":
      const tomorrow = addDays(now, 1);
      return {
        from: new Date(tomorrow.setHours(0, 0, 0, 0)),
        to: new Date(tomorrow.setHours(23, 59, 59, 999)),
      };

    case "week":
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };

    case "month":
      return {
        from: startOfMonth(now),
        to: endOfMonth(now),
      };

    default:
      return null;
  }
}