"use client";

import { useRouter } from "next/navigation";
import { Timer, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  filter: string;
  mode?: string;
}

export default function ModeToggle({ filter, mode }: ModeToggleProps) {
  const router = useRouter();
  const currentMode = mode || "todo";

  const handleToggle = (newMode: string) => {
    router.push(`/admin?filter=${filter}&mode=${newMode}`);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg">
      <Button
        variant={currentMode === "pomodoro" ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5"
        onClick={() => handleToggle("pomodoro")}
      >
        <Timer className="h-3.5 w-3.5" />
        <span>Pomodoro</span>
      </Button>
      <Button
        variant={currentMode === "todo" ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5"
        onClick={() => handleToggle("todo")}
      >
        <ListTodo className="h-3.5 w-3.5" />
        <span>Todo</span>
      </Button>
    </div>
  );
}
