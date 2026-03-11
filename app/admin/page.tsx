import Header from "@/components/header";
import StatsCards from "@/components/statsCards";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import AddTaskModal from "@/components/addTaskModal";

export default async function Home() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  const allTasks = await prisma.task.findMany({
    where: {
      userId: userId,
    },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();
  const activeTasksData = allTasks.filter(task => {
    if (!task.startTime || !task.endTime) return false;
    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    return now >= start && now <= end && !task.completed;
  }).map(task => ({ id: task.id, title: task.title }));

  return (
    <>
      <AddTaskModal />
      <div className="space-y-10">
        <Header activeTasks={activeTasksData} />
        <StatsCards tasks={allTasks} />
      </div>
    </>
  );
}
