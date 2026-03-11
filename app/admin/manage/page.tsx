import ManageTasks from "@/components/manageTasks";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import AddTaskModal from "@/components/addTaskModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ManageFilters from "@/components/filters";

interface ManagePageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function ManagePage({ searchParams }: ManagePageProps) {
  const params = await searchParams;
  const filter = params?.filter || "all";

  const session = await getServerSession();
  const userId = session?.user?.id;

  const allTasks = await prisma.task.findMany({
    where: {
      userId: userId,
    },
    orderBy: { dueDate: "desc" },
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const filteredTasks = allTasks.filter((task) => {
    const dueDate = new Date(task.dueDate);

    switch (filter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      case "today":
        return dueDate >= today && dueDate < tomorrow;
      case "week":
        return dueDate >= today && dueDate <= weekEnd;
      default:
        return true;
    }
  });

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
        <ManageFilters />
        <ManageTasks tasks={filteredTasks} />
      </div>
    </>
  );
}
