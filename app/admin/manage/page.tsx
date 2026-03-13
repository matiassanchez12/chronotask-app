"use client";

import { useState, useEffect } from "react";
import ManageTasks from "@/components/manageTasks";
import AddTaskModal from "@/components/addTaskModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocalTasks, LocalTask } from "@/lib/localUser";
import { useSession } from "next-auth/react";
import { Task } from "@/generated/prisma/client";

export default function ManagePage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[] | LocalTask[]>([]);
  const [loading, setLoading] = useState(true);
  // hacer ssr con server actions denuevo las request para que quede mas prolijo el codigo y que sea mas rapida la carga de los paginas
  useEffect(() => {
    if (session) {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then((data) => {
          setTasks(data.tasks || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setTasks(getLocalTasks());
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <>
        <AddTaskModal />
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AddTaskModal />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/admin" 
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <h1 className="text-3xl font-bold">Gestionar Tareas</h1>
            <p className="text-muted-foreground mt-1">Edita o elimina tus tareas</p>
          </div>
        </div>
        <ManageTasks tasks={tasks} />
      </div>
    </>
  );
}
