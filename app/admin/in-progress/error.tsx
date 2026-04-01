"use client";

import { InProgressLayout } from "./components/in-progress-layout";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <InProgressLayout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-destructive text-lg">Algo salió mal</p>
        <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    </InProgressLayout>
  );
}
