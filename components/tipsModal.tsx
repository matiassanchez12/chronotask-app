"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

const tips = [
  {
    title: "Ritmo 90/20",
    content: [
      { label: "Planear", value: "10 min" },
      { label: "Trabajo", value: "90 min" },
      { label: "Descanso", value: "20 min" },
      { label: "Trabajo", value: "90 min" },
      { label: "Descanso", value: "20 min" },
      { label: "Pausa larga", value: "" },
      { label: "1-2 bloques más livianos", value: "" },
      { label: "Cierre del día", value: "" },
    ],
  },
  {
    title: "Pomodoro (25/5)",
    content: [
      { label: "Trabajo", value: "25 min" },
      { label: "Descanso", value: "5 min" },
      { label: "Trabajo", value: "25 min" },
      { label: "Descanso", value: "5 min" },
      { label: "Trabajo", value: "25 min" },
      { label: "Descanso", value: "5 min" },
      { label: "Trabajo", value: "25 min" },
      { label: "Descanso", value: "5 min" },
      { label: "Pausa larga", value: "15-30 min" },
    ],
  },
  {
    title: "Deep Work",
    content: [
      { label: "Eliminar distracciones", value: "" },
      { label: "Trabajo focus", value: "90 min" },
      { label: "Sin email, sin teléfono", value: "" },
      { label: "Pausa", value: "10-15 min" },
    ],
  },
  {
    title: "Trabajo Profundo",
    content: [
      { label: "Programar en bloques de", value: "60-90 min" },
      { label: "Descansar sin pantalla", value: "10-15 min" },
      { label: "Después de 3 bloques", value: "20-30 min" },
      { label: "Método de Cal Newport", value: "" },
    ],
  },
  {
    title: "Separar Modos",
    content: [
      { label: "Modo pensar:", value: "" },
      { label: "- Arquitectura", value: "" },
      { label: "- Decisiones técnicas", value: "" },
      { label: "- Planificar tareas", value: "" },
      { label: "Modo construir:", value: "" },
      { label: "- Solo programar", value: "" },
      { label: "No mezclar actividades", value: "" },
    ],
  },
  {
    title: "Cierre del Día",
    content: [
      { label: "Shutdown ritual", value: "" },
      { label: "Anotar qué hiciste hoy", value: "" },
      { label: "Escribir primer paso para mañana", value: "" },
      { label: "Cerrar IDE y herramientas", value: "" },
    ],
  },
  {
    title: "Relajar el Sistema Nervioso",
    content: [
      { label: "Respirar lento", value: "3-5 min" },
      { label: "Exhalar más largo que inhalar", value: "" },
      { label: "Caminar sin celular", value: "10-20 min" },
      { label: "Mirar a lo lejos", value: "2-3 min" },
      { label: "Movimiento físico corto", value: "" },
      { label: "Escribir lo que tenés en cabeza", value: "5 min" },
    ],
  },
];

export default function TipsModal() {
  const [currentTip, setCurrentTip] = useState(0);
  const [open, setOpen] = useState(false);

  const handlePrev = () => {
    setCurrentTip((prev) => (prev === 0 ? tips.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentTip((prev) => (prev === tips.length - 1 ? 0 : prev + 1));
  };

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) setCurrentTip(0);
  };

  const tip = tips[currentTip];

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Tips de productividad"
        >
          <Lightbulb className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            {tip.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {tip.content.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className={item.value ? "font-medium" : "font-medium text-muted-foreground"}>
                {item.label}
              </span>
              {item.value && (
                <span className="text-sm text-muted-foreground">{item.value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentTip + 1}/{tips.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="gap-1"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
