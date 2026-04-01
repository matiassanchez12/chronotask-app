import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function Loading() {
  return (
    <DashboardLayout tasks={[]}>
      <div className="space-y-10">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
