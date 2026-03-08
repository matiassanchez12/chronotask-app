"use client";

import { useRouter } from "next/navigation";
import { Timer, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  filter: string;
  mode?: string;
  hasActiveTasks?: boolean;
}

export default function ModeToggle({ filter, mode, hasActiveTasks }: ModeToggleProps) {
  const router = useRouter();
  const currentMode = mode || (hasActiveTasks ? 'counter' : 'todo');

  const handleToggle = (newMode: string) => {
    router.push(`/admin?filter=${filter}&mode=${newMode}`);
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-card border border-border rounded-lg">
      <Button
        variant={currentMode === "counter" ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5"
        onClick={() => handleToggle("counter")}
      >
        <Timer className="h-3.5 w-3.5" />
        <span>Counter</span>
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
