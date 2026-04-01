import { fetchDashboardData } from "@/components/dashboard/fetch-dashboard-data";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function Home() {
  const data = await fetchDashboardData();

  return (
    <DashboardLayout tasks={data.tasks}>
      <DashboardContent data={data} />
    </DashboardLayout>
  );
}
