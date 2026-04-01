"use client";

import Header from "@/app/admin/(dashboard)/components/header";
import { Task } from "@/generated/prisma/client";

interface DashboardLayoutProps {
  children: React.ReactNode;
  tasks: Task[];
}

export function DashboardLayout({ children, tasks }: DashboardLayoutProps) {
  return (
    <div className="space-y-10">
      <Header tasks={tasks} />
      {children}
    </div>
  );
}
