"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <p>Error al cargar las tareas.</p>
      </div>
      <Button
        variant="outline"
        onClick={() => reset()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Reintentar
      </Button>
    </div>
  );
}
