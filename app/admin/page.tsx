import Filters from "@/components/filters";
import Header from "@/components/header";
import ModeToggle from "@/components/modeToggle";
import Tasks from "@/components/tasks";
import { prisma } from "@/lib/prisma";
import { getDateRange } from "@/lib/dateFilters";
import { getServerSession } from "next-auth";

interface HomeProps {
  searchParams: Promise<{ filter?: string; mode?: string }>;
}

export default async function Home({
  searchParams,
}: HomeProps) {
  const params = await searchParams;
  const session = await getServerSession();
  const userId = session?.user?.id;
  const filter = params?.filter ?? "today";
  const range = getDateRange(filter);

  const tasks = await prisma.task.findMany({
    where: {
      ...(range ? {
        dueDate: {
          gte: range.from,
          lte: range.to,
        },
      } : {}),
      userId: userId,
    },
    orderBy: { dueDate: "asc" },
  });

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        <div className="flex justify-end mb-4">
          <ModeToggle filter={filter} mode={params?.mode} />
        </div>
        <Filters />
        <Tasks tasks={tasks} />
      </div>
    </div>
  );
}
