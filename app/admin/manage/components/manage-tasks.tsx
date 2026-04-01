"use client";

import { useCallback, useState, useMemo } from "react";
import { format } from "date-fns";
import { Task } from "@/generated/prisma/client";
import { DeleteTaskModal } from "@/components/modals/delete-task-modal";
import { getWeekStart, getWeekDays } from "@/lib/dateFilters";
import { TaskWithSubtasks } from "@/components/task-card";
import { ListViewByDate } from "./list-view-by-date";
import { WeekView } from "./week-view";

interface ManageTasksProps {
  tasks: TaskWithSubtasks[];
  viewMode?: "list" | "columns";
  weekFrom?: string;
  weekTo?: string;
  onRefresh?: () => void;
}

export default function ManageTasks({
  tasks,
  viewMode = "list",
  weekFrom,
  weekTo,
  onRefresh,
}: ManageTasksProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

  const computedWeekFrom = useMemo(() => 
    weekFrom || format(getWeekStart(new Date()), "yyyy-MM-dd"),
    [weekFrom]
  );

  const computedWeekTo = useMemo(() => 
    weekTo || format(getWeekDays(getWeekStart(new Date()))[6], "yyyy-MM-dd"),
    [weekTo]
  );

  const handleDelete = useCallback((task: Task) => {
    setTaskToDelete({ id: task.id, title: task.title });
    setShowDeleteModal(true);
  }, []);

  const handleRefresh = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    }
  }, [onRefresh]);

  return (
    <div className={`flex flex-col w-full h-full overflow-x-auto`}>
      {viewMode === "columns" ? (
        <WeekView
          tasks={tasks}
          weekFrom={computedWeekFrom}
          weekTo={computedWeekTo}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      ) : (
        <ListViewByDate tasks={tasks} />
      )}

      <DeleteTaskModal
        taskId={taskToDelete?.id || ""}
        taskTitle={taskToDelete?.title || ""}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTaskToDelete(null);
        }}
      />
    </div>
  );
}
