"use server";

import AddTaskModal from "@/components/modals/add-task-modal";
import { getTasks } from "@/app/actions";
import Header from "@/components/header";
import ManageTasks from "@/components/manage-tasks";
import ManageFilters from "@/components/filters";

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
        <Header title="Gestionar" subTitle="Edita o elimina tareas" />

        <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 pb-8">
          <ManageFilters />

          {tasks.length === 0 && (
            <p className="text-muted-foreground text-sm">No hay tareas en este rango.</p>
          )}

          {tasks.length > 0 && <ManageTasks tasks={tasks} />}
        </div>
      </div>
    </>
  );
}
