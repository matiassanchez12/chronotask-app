"use client";

import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Leaf, NotebookIcon, FlameIcon } from "lucide-react";
import { Task } from "@/generated/prisma/browser";
import { getFormatedDate } from "@/lib/utils";
import ActionCard from "./action-card";
import { format } from "date-fns";
import Clock from "./clock";

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
      
      return (getFormatedDate(dueDate) === getFormatedDate(now)) && task.endTime! > now && !task.completed;
    })
}

function findNextWeekTasks(tasks: Task[]) {
  return tasks
    .filter((task: Task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const nextSunday = new Date(today);
      nextSunday.setDate(today.getDate() + (7 - today.getDay()) % 7); // Next Sunday
      const nextSaturday = new Date(nextSunday);
      nextSaturday.setDate(nextSunday.getDate() + 6); // Next Saturday

      return (dueDate >= nextSunday && dueDate <= nextSaturday) && !task.completed;
    })
}

export default function Header({ tasks = [] }: HeaderProps) {
  const [now, setNow] = useState(() => new Date());

  const activeTasks = findActiveTasks(tasks);
  const todayTasks = findTodayTasks(tasks);
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

      {todayTasks.length > 0 && (
        <ActionCard
          text={`Para hoy`}
          subtext={todayTasks.map(t => t.title).join(', ')}
          href="/admin/manage?filter=today"
          color="lime"
          Icon={<NotebookIcon className="h-4 w-4" />}
        />
      )}  

      {
        isWeekend && (
          <ActionCard
            text={`Para esta semana`}
            subtext={nextWeekTasks.map(t => t.title).join(', ')}
            href="/admin/manage?filter=next-week"
            color="teal"
            Icon={<Leaf className="h-4 w-4" />}
          />
        )
      }
    </div>
  );
}