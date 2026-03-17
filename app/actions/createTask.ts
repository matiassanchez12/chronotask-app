"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions, getServerSession } from '@/lib/auth';

export type ActionResult = { success: true } | { success: false; error: string };

export async function createTask(formData: FormData): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    if (userEmail === process.env.TEST_USER) {
      const taskCount = await prisma.task.count({
        where: { userId },
      });

      if (taskCount >= 10) {
        return { success: false, error: "Límite de 10 tareas alcanzado para modo demo" };
      }
    }

    const title = formData.get("title") as string;
    const dueDate = formData.get("dueDate") as string;
    const priority = (formData.get("priority") as string) || "medium";
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const usePomodoro = formData.get("usePomodoro") as string;

    if (!title?.trim()) return { success: false, error: "Title is required" };
    if (!dueDate) return { success: false, error: "Due date is required" };

    await prisma.task.create({
      data: {
        title: title.trim(),
        dueDate: new Date(dueDate),
        priority,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        usePomodoro: usePomodoro !== "false",
        userId,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("createTask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create task",
    };
  }
}
