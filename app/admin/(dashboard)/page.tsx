import { getTasks } from "@/app/actions";
import Header from "@/app/admin/(dashboard)/components/header";
import StatsCards from "@/components/stats-cards";

export default async function Home() {
  const tasks = await getTasks();

  return (
    <div className="space-y-10">
      <Header tasks={tasks} />
      <StatsCards tasks={tasks} />
    </div>
  );
}