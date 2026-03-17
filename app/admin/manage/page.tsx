"use server";

import ManageTasks from "@/components/manageTasks";
import AddTaskModal from "@/components/addTaskModal";
import { getTasks } from "@/app/actions";
import Header from "@/components/header";

export default async function ManagePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ filter?: string }> 
}) {
  const params = await searchParams;
  const filter = params.filter || "all";
  const tasks = await getTasks(filter); 

  return (
    <>
      <AddTaskModal />
      <div className="space-y-6">
        <Header title="Gestionar Tareas" subTitle="Edita o elimina tus tareas" />
        <ManageTasks tasks={tasks} />
      </div>
    </>
  );
}
