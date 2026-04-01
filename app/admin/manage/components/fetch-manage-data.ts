import { getTasks, getRoutineTasks } from "@/app/actions";

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
  const filter = params.filter || "all";
  const from = params.from;
  const to = params.to;
  const view = (params.view || "columns") as "list" | "columns";

  const [tasks, routines] = await Promise.all([
    getTasks(filter, { from, to }),
    getRoutineTasks()
  ]);

  return { tasks, routines, filter, from, to, view };
}
