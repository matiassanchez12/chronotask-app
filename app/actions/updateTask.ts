"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions, getServerSession } from "@/lib/auth";
import type { ActionResult } from "./createTask";

async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "No estas autenticado" } as ActionResult;
  }
  return null;
}

export async function updateTask(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const title = formData.get("title") as string;
    const dueDate = formData.get("dueDate") as string;
    const priority = (formData.get("priority") as string) || "medium";
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const usePomodoro = formData.get("usePomodoro") as string;
    const isRoutine = formData.get("isRoutine") as string;

    if (!title?.trim()) return { success: false, error: "Title is required" };
    if (!dueDate) return { success: false, error: "Due date is required" };

    await prisma.task.update({
      where: { id },
      data: {
        title: title.trim(),
        dueDate: new Date(dueDate),
        priority,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        usePomodoro: usePomodoro === "true",
        isRoutine: isRoutine === "true",
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("updateTask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update task",
    };
  }
}

export async function addTaskDependency(
  fromTaskId: string,
  toTaskId: string
): Promise<ActionResult> {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    if (fromTaskId === toTaskId) {
      return { success: false, error: "Una tarea no puede depender de sí misma" };
    }

    const toTask = await prisma.task.findUnique({
      where: { id: toTaskId },
    });

    if (!toTask) {
      return { success: false, error: "La tarea no existe" };
    }

    const hasCycle = await checkForCycle(fromTaskId, toTaskId);
    if (hasCycle) {
      return { success: false, error: "No se puede crear una dependencia cíclica" };
    }

    await prisma.taskDependency.create({
      data: {
        fromTaskId,
        toTaskId,
      },
    });

    revalidatePath("/admin/diagram");
    return { success: true };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
      return { success: false, error: "La dependencia ya existe" };
    }
    console.error("addTaskDependency:", e);
    return {
      success: false,
      error: "Failed to add dependency",
    };
  }
}

export async function removeTaskDependency(
  fromTaskId: string,
  toTaskId: string
): Promise<ActionResult> {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    await prisma.taskDependency.delete({
      where: {
        fromTaskId_toTaskId: {
          fromTaskId,
          toTaskId,
        },
      },
    });

    revalidatePath("/admin/diagram");
    return { success: true };
  } catch (e) {
    console.error("removeTaskDependency:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to remove dependency",
    };
  }
}

async function checkForCycle(fromTaskId: string, toTaskId: string): Promise<boolean> {
  const visited = new Set<string>();
  const stack = [toTaskId];

  while (stack.length > 0) {
    const current = stack.pop()!;
    
    if (current === fromTaskId) {
      return true;
    }

    if (visited.has(current)) {
      continue;
    }
    visited.add(current);

    const task = await prisma.task.findUnique({
      where: { id: current },
      include: { dependsOn: { select: { id: true } } },
    });

    for (const dep of task?.dependsOn || []) {
      stack.push(dep.id);
    }
  }

  return false;
}