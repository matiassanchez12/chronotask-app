"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getUserSettings,
  updatePomodoroSettings,
  updateDeleteConfirmation,
  updateFontSize,
  deleteUserAccount,
} from "@/app/actions/settings";
import { signOut } from "next-auth/react";
import { Settings, Timer, Trash2, AlertTriangle, Loader2, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const [pomodoro, setPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true);
  const [fontSize, setFontSize] = useState(16);

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
        setFontSize(settings.fontSize);
        setSettingsLoaded(true);
      }
      setLoading(false);
    }
    loadSettings();
  }, [settingsLoaded]);

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

  const handleFontSizeChange = async (value: number) => {
    setFontSize(value);
    const result = await updateFontSize(value);
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
      className="max-w-2xl mx-auto p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-3.5rem)] [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
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
          <Button onClick={handlePomodoroSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Configura el tamaño de fuente de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fontSize">Tamaño de fuente</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="fontSize"
                  type="number"
                  min={12}
                  max={24}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24"
                />
                <Button onClick={() => handleFontSizeChange(fontSize)} disabled={saving}>
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
            <div
              className="p-4 border rounded-md bg-muted/30"
              style={{ fontSize: `${fontSize}px` }}
            >
              Vista previa del texto
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
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
              >
                Sí
              </Button>
              <Button
                variant={!confirmBeforeDelete ? "default" : "secondary"}
                size="sm"
                onClick={() => handleConfirmChange(false)}
              >
                No
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
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
