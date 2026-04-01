import ManageFilters from "@/components/filters";
import RoutineSidebar from "@/components/routine-sidebar";
import ManageTasks from "@/app/admin/manage/components/manage-tasks";
import { ManageData } from "./fetch-manage-data";

interface ManageContentProps {
  data: ManageData;
}

export function ManageContent({ data }: ManageContentProps) {
  return (
    <div className="flex flex-col gap-3 w-full h-full pt-4">
      <ManageFilters />

      <div className="flex gap-4 h-full w-full overflow-y-auto">
        <RoutineSidebar routines={data.routines} />
        <ManageTasks
          tasks={data.tasks}
          viewMode={data.view}
          weekFrom={data.from}
          weekTo={data.to}
        />
      </div>
    </div>
  );
}
