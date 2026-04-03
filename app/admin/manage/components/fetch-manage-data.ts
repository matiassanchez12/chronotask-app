import { getTasks, getRoutineTasks } from "@/app/actions";
import { format } from "date-fns";
import { getWeekStart, getWeekDays } from "@/lib/dateFilters";

export type ManageSearchParams = {
  filter?: string;
  from?: string;
  to?: string;
  view?: string;
};

export type ManageData = {
  tasks: Awaited<ReturnType<typeof getTasks>>;
  routines: Awaited<ReturnType<typeof getRoutineTasks>>;
  filter: string;
  from?: string;
  to?: string;
  view: "list" | "columns";
};

export async function fetchManageData(params: ManageSearchParams): Promise<ManageData> {
  let filter = params.filter || "all";
  let from = params.from;
  let to = params.to;
  const view = (params.view || "columns") as "list" | "columns";

  if (!from && !to) {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekDays = getWeekDays(weekStart);
    from = format(weekStart, "yyyy-MM-dd");
    to = format(weekDays[6], "yyyy-MM-dd");
    filter = "range";
  }

  const [tasks, routines] = await Promise.all([
    getTasks(filter, { from, to }),
    getRoutineTasks()
  ]);

  return { tasks, routines, filter, from, to, view };
}
