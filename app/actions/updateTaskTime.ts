"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./createTask";

export async function updateTaskTime(
  taskId: string,
  newStartTime: Date,
  newEndTime: Date
): Promise<ActionResult> {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: "Task not found" };
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("updateTaskTime:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update task time",
    };
  }
}
