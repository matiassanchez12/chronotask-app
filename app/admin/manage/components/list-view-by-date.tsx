"use client";

import { useState, useMemo, memo, useCallback } from "react";
import { Task } from "@/generated/prisma/client";
import { formatDayHeader, groupTasksByDate } from "@/lib/dateFilters";
import { TaskCard, priorityConfig, TaskWithSubtasks } from "../../../../components/task-card/task-card";
import { DeleteTaskModal } from "@/components/modals/delete-task-modal";

interface ListViewByDateProps {
  tasks: TaskWithSubtasks[];
}

function ListViewByDateInner({ tasks }: { tasks: TaskWithSubtasks[] }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);
  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks]);

  const handleDelete = useCallback((task: Task) => {
    setTaskToDelete({ id: task.id, title: task.title });
    setShowDeleteModal(true);
  }, []);

  if (tasks.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay tareas.</p>;
  }

  return (
    <>
      <div className="space-y-6 pt-3 pb-6 w-full">
        {Array.from(tasksByDate.entries()).map(([dateKey, dayTasks]) => {
          const date = new Date(dateKey + "T00:00:00");
          return (
            <div key={dateKey}>
              <h2 className="text-md text-muted-foreground font-semibold mb-3">
                {formatDayHeader(date)} ({dayTasks.length})
              </h2>
              <div className="space-y-2">
                {dayTasks.map((task) => {
                  const priority = priorityConfig[task.priority];
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      priority={priority}
                      onDelete={() => handleDelete(task)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <DeleteTaskModal
        taskId={taskToDelete?.id || ""}
        taskTitle={taskToDelete?.title || ""}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTaskToDelete(null);
        }}
      />
    </>
  );
}

export const ListViewByDate = memo(ListViewByDateInner);
export type { ListViewByDateProps };
