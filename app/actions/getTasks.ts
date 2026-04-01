import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

async function getSession() {
  return getServerSession(authOptions);
}

const getDates = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);
  return [today, todayEnd, weekStart, weekEnd];
}

export async function getTasks(filter?: string, dateRange?: { from?: string; to?: string }) {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id, isRoutine: false },
    orderBy: { dueDate: "desc" },
    include: {
      subtasks: {
        orderBy: { order: "desc" },
      },
    },
  });

  if (!filter) {
    return tasks;
  }

  const [today, todayEnd, weekStart, weekEnd] = getDates();

  return tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);

    switch (filter) {
      case "today":
        return dueDate >= today && dueDate <= todayEnd;
      case "week":
        return dueDate > weekStart && dueDate <= weekEnd;
      case "overdue":
        return dueDate < today && !task.completed;
      case "completed":
        return task.completed;
      case "routine":
        return task.isRoutine;
      case "range":
        if (dateRange?.from && dateRange?.to) {
          const from = new Date(dateRange.from + "T00:00:00");
          const to = new Date(dateRange.to + "T00:00:00");
          to.setHours(23, 59, 59, 999);
          return dueDate >= from && dueDate <= to;
        }
        return true;
      case "active": {
        const now = new Date();
        return (now >= task.startTime! && now <= task.endTime!) && !task.completed;
      }
      default:
        return true;
    }
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