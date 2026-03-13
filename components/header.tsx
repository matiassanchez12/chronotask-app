"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, ChevronRight, NotebookTextIcon } from "lucide-react";
import { Task } from "@/generated/prisma/browser";
import { getFormatedDate } from "@/lib/utils";

interface HeaderProps {
  tasks?: Task[];
}

function findActiveTasks(tasks: Task[]) {
  return tasks
    .filter((task: Task) => {
      if (!task.startTime || !task.endTime) return false;
      const start = new Date(task.startTime);
      const end = new Date(task.endTime);
      const now = new Date();
      return now >= start && now <= end && !task.completed;
    })
    .map((task: Task) => ({ id: task.id, title: task.title }));
}

function findTodayTasks(tasks: Task[]) {
  return tasks
    .filter((task: Task) => {
      const dueDate = new Date(task.dueDate);
      const now = new Date();

      return (getFormatedDate(dueDate) === getFormatedDate(now)) && !task.completed;
    })
}


function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = format(now, "HH:mm:ss");

  return (
    <p className="text-xl font-mono text-slate-600 dark:text-slate-300">
      {timeString}
    </p>
  );
}

export default function Header({ tasks = [] }: HeaderProps) {
  const [now, setNow] = useState(() => new Date());

  const activeTasks = findActiveTasks(tasks);
  const todayTasks = findTodayTasks(tasks);

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
        <Link href="/admin/in-progress" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg bg-amber-500/10 border border-amber-500/20 group">
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
          <Button variant="ghost" size="sm" className="text-amber-500 gap-1 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-log">
            Ver
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}

      {todayTasks.length > 0 && (
        <Link href="/admin/manage" className="flex items-center gap-3 p-3 cursor-pointer rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:text-emerald-400 hover:bg-emerald-500/10 group">
          <div className="p-1.5 rounded-md bg-emerald-500/20">
            <NotebookTextIcon className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-emerald-500">
              {todayTasks.length} tarea{todayTasks.length > 1 ? 's' : ''} para hoy
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {todayTasks.map(t => t.title).join(', ')}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="text-emerald-500 gap-1 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-log">
            Ver
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
