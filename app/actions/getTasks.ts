import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

async function getSession() {
  return getServerSession(authOptions);
}

export async function getTasks(filter?: string, dateRange?: { from?: string; to?: string }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const from = dateRange?.from ? new Date(dateRange.from + "T00:00:00") : undefined;
  const to = dateRange?.to ? new Date(dateRange.to + "T23:59:59") : undefined;

  const conditions: Record<string, object> = {
    today: { dueDate: { gte: today, lte: todayEnd } },
    week: { dueDate: { gte: weekStart, lte: weekEnd } },
    overdue: { dueDate: { lt: today }, completed: false },
    completed: { completed: true },
    routine: { isRoutine: true },
    active: { startTime: { lte: now }, endTime: { gte: now }, completed: false },
    range: from && to ? { dueDate: { gte: from, lte: to } } : {},
  };

  const filterKey = filter || "";
  const baseWhere = { userId: session.user.id, isRoutine: false };

  return prisma.task.findMany({
    where: { ...baseWhere, ...conditions[filterKey] } as object,
    orderBy: { dueDate: "desc" },
    include: {
      subtasks: { orderBy: { order: "desc" } },
    },
  });
}

export async function getRoutineTasks() {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  return prisma.task.findMany({
    where: { userId: session.user.id, isRoutine: true },
    orderBy: { startTime: "asc" },
    include: {
      subtasks: { orderBy: { order: "asc" } },
    },
  });
}