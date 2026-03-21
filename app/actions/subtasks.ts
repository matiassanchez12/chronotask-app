"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions, getServerSession } from "@/lib/auth";
import type { ActionResult } from "./createTask";

export async function createSubtask(
  taskId: string,
  description: string
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    if (!description.trim()) {
      return { success: false, error: "La descripción es requerida" };
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: "La tarea no existe" };
    }

    if (task.userId !== userId) {
      return { success: false, error: "No tienes permiso para agregar subtareas" };
    }

    const maxOrder = await prisma.subtask.aggregate({
      where: { taskId },
      _max: { order: true },
    });

    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    await prisma.subtask.create({
      data: {
        description: description.trim(),
        taskId,
        order: nextOrder,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("createSubtask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create subtask",
    };
  }
}

export async function updateSubtask(
  id: string,
  data: { description?: string; completed?: boolean }
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    const subtask = await prisma.subtask.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!subtask) {
      return { success: false, error: "La subtarea no existe" };
    }

    if (subtask.task.userId !== userId) {
      return { success: false, error: "No tienes permiso para editar esta subtarea" };
    }

    await prisma.subtask.update({
      where: { id },
      data: {
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.completed !== undefined && { completed: data.completed }),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("updateSubtask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update subtask",
    };
  }
}

export async function toggleSubtask(id: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    const subtask = await prisma.subtask.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!subtask) {
      return { success: false, error: "La subtarea no existe" };
    }

    if (subtask.task.userId !== userId) {
      return { success: false, error: "No tienes permiso para editar esta subtarea" };
    }

    await prisma.subtask.update({
      where: { id },
      data: { completed: !subtask.completed },
    });

    revalidatePath("/admin/manage");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: "Failed to toggle subtask",
    };
  }
}

export async function deleteSubtask(id: string): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    const subtask = await prisma.subtask.findUnique({
      where: { id },
      include: { task: true },
    });

    if (!subtask) {
      return { success: false, error: "La subtarea no existe" };
    }

    if (subtask.task.userId !== userId) {
      return { success: false, error: "No tienes permiso para eliminar esta subtarea" };
    }

    await prisma.subtask.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("deleteSubtask:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete subtask",
    };
  }
}

export async function getSubtasks(taskId: string) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, subtasks: [], error: "No estas autenticado" };
    }

    const subtasks = await prisma.subtask.findMany({
      where: { taskId },
      orderBy: { order: "asc" },
    });

    return { success: true, subtasks };
  } catch (e) {
    console.error("getSubtasks:", e);
    return {
      success: false,
      subtasks: [],
      error: e instanceof Error ? e.message : "Failed to get subtasks",
    };
  }
}

export async function reorderSubtasks(
  taskId: string,
  orderedIds: string[]
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return { success: false, error: "La tarea no existe" };
    }

    if (task.userId !== userId) {
      return { success: false, error: "No tienes permiso para reordenar subtareas" };
    }

    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.subtask.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("reorderSubtasks:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to reorder subtasks",
    };
  }
}
