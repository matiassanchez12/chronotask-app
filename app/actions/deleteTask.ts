"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./createTask";

export async function deleteTask(id: string): Promise<ActionResult> {
  try {
    await prisma.task.delete({
      where: { id },
    });
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("deleteTask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete task",
    };
  }
}