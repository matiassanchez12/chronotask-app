"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DangerTabProps {
  onDeleteClick: () => void;
}

export function DangerTab({ onDeleteClick }: DangerTabProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Zona de peligro</h2>
        <p className="text-muted-foreground">Acciones irreversibles. Procede con precaución.</p>
      </div>

      <Card className="rounded-2xl border-2 border-destructive/30 bg-destructive/5">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Eliminar cuenta
          </CardTitle>
          <CardDescription>
            Esta acción eliminará permanentemente tu cuenta y todas tus tareas asociadas.
            No se puede deshacer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-xl bg-background/50">
            <div className="space-y-1">
              <p className="font-medium">Eliminar mi cuenta</p>
              <p className="text-sm text-muted-foreground">
                Todos tus datos serán eliminados de forma permanente
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={onDeleteClick}
              className="rounded-xl gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
