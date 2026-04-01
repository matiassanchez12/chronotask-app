"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface PreferencesTabProps {
  confirmBeforeDelete: boolean;
  onConfirmChange: (value: boolean) => void;
}

export function PreferencesTab({ confirmBeforeDelete, onConfirmChange }: PreferencesTabProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Preferencias</h2>
        <p className="text-muted-foreground">Personaliza tu experiencia en la app</p>
      </div>

      <Card className="rounded-2xl border bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Seguridad</CardTitle>
          <CardDescription>Configura opciones de protección</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <Label className="text-base font-medium">Confirmar antes de eliminar</Label>
              <p className="text-sm text-muted-foreground">
                {confirmBeforeDelete ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Se mostrará confirmación antes de eliminar
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-muted-foreground" />
                    Sin confirmación (acción inmediata)
                  </span>
                )}
              </p>
            </div>
            <Switch
              checked={confirmBeforeDelete}
              onCheckedChange={onConfirmChange}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
