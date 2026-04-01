"use client";

import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Leaf, FlameIcon } from "lucide-react";
import { Task } from "@/generated/prisma/browser";
import { findActiveTasks, findNextWeekTasks } from "@/lib/dashboard-utils";
import ActionCard from "./action-card";
import { format } from "date-fns";
import Clock from "./clock";

interface HeaderProps {
  tasks?: Task[];
}

export default function Header({ tasks = [] }: HeaderProps) {
  const [now, setNow] = useState(() => new Date());
  const activeTasks = findActiveTasks(tasks);
  const nextWeekTasks = findNextWeekTasks(tasks);

  const isWeekend = now.getDay() === 0;

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
        <ActionCard
          text={`En proceso`}
          subtext={activeTasks.map(t => t.title).join(', ')}
          href="/admin/in-progress"
          color="amber"
          Icon={<FlameIcon className="h-4 w-4" />}
        />
      )}

      {isWeekend && nextWeekTasks.length > 0 && (
        <ActionCard
          text={`Para esta semana`}
          subtext={nextWeekTasks.map(t => t.title).join(', ')}
          href="/admin/manage?filter=next-week"
          color="teal"
          Icon={<Leaf className="h-4 w-4" />}
        />
      )}
    </div>
  );
}
