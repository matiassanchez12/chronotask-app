"use server";

import { prisma } from "@/lib/prisma";
import { authOptions, getServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: true } | { success: false; error: string };

export async function getUserSettings() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return null;
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.userSettings.create({
        data: { userId },
      });
    }

    return settings;
  } catch (e) {
    console.error("getUserSettings:", e);
    return null;
  }
}

export async function updatePomodoroSettings(
  pomodoroDuration: number,
  shortBreakDuration: number,
  longBreakDuration: number
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        pomodoroDuration,
        shortBreakDuration,
        longBreakDuration,
      },
      create: {
        userId,
        pomodoroDuration,
        shortBreakDuration,
        longBreakDuration,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (e) {
    console.error("updatePomodoroSettings:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update settings",
    };
  }
}

export async function updateDeleteConfirmation(
  confirmBeforeDelete: boolean
): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        confirmBeforeDelete,
      },
      create: {
        userId,
        confirmBeforeDelete,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (e) {
    console.error("updateDeleteConfirmation:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update settings",
    };
  }
}

export async function deleteUserAccount(): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("deleteUserAccount:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete account",
    };
  }
}

export async function getDeleteConfirmationSetting(): Promise<boolean> {
  try {
    const settings = await getUserSettings();
    return settings?.confirmBeforeDelete ?? true;
  } catch (e) {
    console.error("getDeleteConfirmationSetting:", e);
    return true;
  }
}

export async function updateFontSize(fontSize: number): Promise<ActionResult> {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return { success: false, error: "No estas autenticado" };
    }

    await prisma.userSettings.upsert({
      where: { userId },
      update: {
        fontSize,
      },
      create: {
        userId,
        fontSize,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    console.error("updateFontSize:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update font size",
    };
  }
}
