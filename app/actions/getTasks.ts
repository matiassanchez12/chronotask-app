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

export async function getTasks(filter?: string, includeDependencies = false) {
  const session = await getSession();

  if (!session?.user?.id) {
    return [];
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { dueDate: "asc" },
    include: {
      subtasks: {
        orderBy: { order: "asc" },
      },
      ...(includeDependencies && {
        dependsOn: { select: { toTaskId: true } },
        dependents: { select: { fromTaskId: true } },
      }),
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
      case "active": {
        const now = new Date();
        return (now >= task.startTime! && now <= task.endTime!) && !task.completed;
      }
      default:
        return true;
    }
  });
}