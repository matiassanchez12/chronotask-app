"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./createTask";

export async function toggleTask(id: string): Promise<ActionResult> {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task)
      return { success: false, error: "Task not found" };

    await prisma.task.update({
      where: { id },
      data: { completed: !task.completed },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("toggleTask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update task",
    };
  }
}