"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  getUserSettings,
  updatePomodoroSettings,
  updateDeleteConfirmation,
  deleteUserAccount,
} from "@/app/actions/settings";
import { signOut, useSession } from "next-auth/react";
import { Settings, Timer, Trash2, AlertTriangle, Loader2, User, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pomodoro, setPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true);

  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      if (settingsLoaded) return;
      const settings = await getUserSettings();
      if (settings) {
        setPomodoro(settings.pomodoroDuration);
        setShortBreak(settings.shortBreakDuration);
        setLongBreak(settings.longBreakDuration);
        setConfirmBeforeDelete(settings.confirmBeforeDelete);
        setSettingsLoaded(true);
      }
      setLoading(false);
    }
    loadSettings();
  }, [settingsLoaded]);

  useEffect(() => {
    async function fetchUserImage() {
      try {
        const res = await fetch("/api/user/image");
        if (res.ok) {
          const data = await res.json();
          setUserImage(data.image);
        }
      } catch (e) {
        console.error("Failed to fetch user image:", e);
      }
    }
    fetchUserImage();
  }, []);

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
        const data = await res.json();
        setUserImage(data.image);
        await updateSession();
        toast.success("Imagen de perfil actualizada");
      } else {
        toast.error("Error al subir imagen");
      }
    } catch (e) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div
      className="p-6 pb-8 space-y-10 min-h-screen [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-cyan-500" />
        <h1 className="text-3xl font-bold">Configuración</h1>
      </div>

      <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-cyan-500" />
            Perfil
          </CardTitle>
          <CardDescription>
            Tu imagen de perfil y información de cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted shrink-0">
              {userImage ? (
                <Image
                  src={userImage}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-medium">{session?.user?.name || "Usuario"}</p>
                <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="gap-2"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "Subiendo..." : "Cambiar foto"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-cyan-500" />
            Pomodoro
          </CardTitle>
          <CardDescription>
            Configura los tiempos de trabajo y descanso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pomodoro">Trabajo (min)</Label>
              <Input
                id="pomodoro"
                type="number"
                min={1}
                max={120}
                value={pomodoro}
                onChange={(e) => setPomodoro(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortBreak">Descanso corto (min)</Label>
              <Input
                id="shortBreak"
                type="number"
                min={1}
                max={30}
                value={shortBreak}
                onChange={(e) => setShortBreak(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longBreak">Descanso largo (min)</Label>
              <Input
                id="longBreak"
                type="number"
                min={1}
                max={60}
                value={longBreak}
                onChange={(e) => setLongBreak(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={handlePomodoroSave} disabled={saving} className="bg-cyan-500 hover:bg-cyan-600">
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-white/10 bg-white/5 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-cyan-500" />
            Eliminar tareas
          </CardTitle>
          <CardDescription>
            Configura si quieres confirmar antes de eliminar una tarea
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Confirmar antes de eliminar</Label>
              <p className="text-sm text-muted-foreground">
                {confirmBeforeDelete
                  ? "Se mostrará un mensaje de confirmación"
                  : "Las tareas se eliminarán directamente"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={confirmBeforeDelete ? "default" : "secondary"}
                size="sm"
                onClick={() => handleConfirmChange(true)}
                className={confirmBeforeDelete ? "bg-cyan-500 hover:bg-cyan-600" : ""}
              >
                Sí
              </Button>
              <Button
                variant={!confirmBeforeDelete ? "default" : "secondary"}
                size="sm"
                onClick={() => handleConfirmChange(false)}
                className={!confirmBeforeDelete ? "bg-cyan-500 hover:bg-cyan-600" : ""}
              >
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50 rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar cuenta
          </CardTitle>
          <CardDescription>
            Elimina tu cuenta y todos tus datos de forma permanente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteAccountModal(true)}
          >
            Eliminar mi cuenta
          </Button>
        </CardContent>
      </Card>

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
