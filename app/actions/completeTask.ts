"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./createTask";

export async function completeTask(
  id: string,
  workTimeMinutes?: number,
  breakTimeMinutes?: number
): Promise<ActionResult> {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    await prisma.task.update({
      where: { id },
      data: { 
        completed: true,
        workTimeMinutes: workTimeMinutes ?? 0,
        breakTimeMinutes: breakTimeMinutes ?? 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("completeTask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to complete task",
    };
  }
}
