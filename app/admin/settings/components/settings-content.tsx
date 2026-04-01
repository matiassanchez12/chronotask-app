"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  updatePomodoroSettings,
  updateDeleteConfirmation,
  updateWeeklyGoal,
  deleteUserAccount,
} from "@/app/actions/settings";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  AccountTab,
  TimerTab,
  GoalTab,
  PreferencesTab,
  DangerTab,
} from "@/app/admin/settings/components";
import { SettingsData } from "./fetch-settings-data";

interface SettingsContentProps {
  initialData: SettingsData;
}

export function SettingsContent({ initialData }: SettingsContentProps) {
  const { data: session, update: updateSession } = useSession();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pomodoro, setPomodoro] = useState(initialData?.pomodoroDuration || 25);
  const [shortBreak, setShortBreak] = useState(initialData?.shortBreakDuration || 5);
  const [longBreak, setLongBreak] = useState(initialData?.longBreakDuration || 15);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(initialData?.confirmBeforeDelete ?? true);
  const [weeklyGoal, setWeeklyGoal] = useState(initialData?.weeklyGoal || 20);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/user/profile", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await updateSession();
        toast.success("Imagen de perfil actualizada");
      } else {
        toast.error("Error al subir imagen");
      }
    } catch {
      toast.error("Error al subir imagen");
    } finally {
      setUploading(false);
    }
  };

  const handlePomodoroSave = async () => {
    setSaving(true);
    const result = await updatePomodoroSettings(pomodoro, shortBreak, longBreak);
    setSaving(false);
    if (result.success) {
      toast.success("Configuración guardada");
    } else {
      toast.error(result.error);
    }
  };

  const handleWeeklyGoalSave = async () => {
    setSaving(true);
    const result = await updateWeeklyGoal(weeklyGoal);
    setSaving(false);
    if (result.success) {
      toast.success("Meta semanal guardada");
    } else {
      toast.error(result.error);
    }
  };

  const handleConfirmChange = async (value: boolean) => {
    setConfirmBeforeDelete(value);
    const result = await updateDeleteConfirmation(value);
    if (result.success) {
      toast.success("Configuración guardada");
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteUserAccount();
    if (result.success) {
      toast.success("Cuenta eliminada");
      signOut({ callbackUrl: "/sign-in" });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <AccountTab
        session={session}
        uploading={uploading}
        onUpload={handleImageUpload}
        fileInputRef={fileInputRef}
      />

      <TimerTab
        pomodoro={pomodoro}
        shortBreak={shortBreak}
        longBreak={longBreak}
        saving={saving}
        onPomodoroChange={setPomodoro}
        onShortBreakChange={setShortBreak}
        onLongBreakChange={setLongBreak}
        onSave={handlePomodoroSave}
      />

      <GoalTab
        weeklyGoal={weeklyGoal}
        saving={saving}
        onGoalChange={setWeeklyGoal}
        onSave={handleWeeklyGoalSave}
      />

      <PreferencesTab
        confirmBeforeDelete={confirmBeforeDelete}
        onConfirmChange={handleConfirmChange}
      />

      {
        session?.user.email !== 'admin@example.com' &&
        <DangerTab onDeleteClick={() => setShowDeleteAccountModal(true)} />
      }

      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Eliminar cuenta"
      >
        <p className="text-muted-foreground mb-6">
          ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción eliminará
          todas tus tareas y no se puede deshacer.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowDeleteAccountModal(false)}
          >
            Cancelar
          </Button>
          <Button type="button" variant="destructive" onClick={handleDeleteAccount}>
            Eliminar cuenta
          </Button>
        </div>
      </Modal>
    </div>
  );
}
