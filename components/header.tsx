"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, ChevronRight } from "lucide-react";

interface ActiveTask {
  id: string;
  title: string;
}

interface HeaderProps {
  activeTasks?: ActiveTask[];
}

function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = format(now, "HH:mm:ss");

  return (
    <p className="text-2xl font-mono text-cyan-500">
      {timeString}
    </p>
  );
}

export default function Header({ activeTasks = [] }: HeaderProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const formatted = format(now, "EEEE d 'de' MMMM yyyy", { locale: es });
  const dayOnly = formatted.slice(0, formatted.indexOf(" "));
  const rest = formatted.slice(formatted.indexOf(" "));
  const capitalized = dayOnly.charAt(0).toUpperCase() + dayOnly.slice(1) + rest;

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">
          {capitalized}
        </h1>
        <Clock />
      </div>

      {activeTasks.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <div className="p-1.5 rounded-md bg-amber-500/20">
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-500">
              {activeTasks.length} tarea{activeTasks.length > 1 ? 's' : ''} en proceso
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {activeTasks.map(t => t.title).join(', ')}
            </p>
          </div>
          <Link href="/admin/in-progress">
            <Button variant="ghost" size="sm" className="text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 gap-1">
              Ver
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
