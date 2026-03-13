"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import StatsCards from "@/components/statsCards";
import AddTaskModal from "@/components/addTaskModal";
import { getLocalTasks } from "@/lib/localUser";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        <div className="space-y-10">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-6 bg-muted rounded w-32"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-20 bg-muted rounded-lg animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AddTaskModal />
      <div className="space-y-10">
        <Header tasks={tasks} />
        <StatsCards tasks={tasks} />
      </div>
    </>
  );
}
