"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: true } | { success: false; error: string };

export async function createTask(formData: FormData): Promise<ActionResult> {
  try {
    const title = formData.get("title") as string;
    const dueDate = formData.get("dueDate") as string;
    const priority = (formData.get("priority") as string) || "medium";
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    if (!title?.trim()) return { success: false, error: "Title is required" };
    if (!dueDate) return { success: false, error: "Due date is required" };

    await prisma.task.create({
      data: {
        title: title.trim(),
        dueDate: new Date(dueDate),
        priority,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("createTask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create task",
    };
  }
}