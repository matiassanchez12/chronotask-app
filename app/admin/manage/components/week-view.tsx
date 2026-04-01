"use client";

import { useMemo, memo, useCallback } from "react";
import { toggleTask as serverToggleTask } from "@/app/actions/toggleTask";
import { format, isSameDay, startOfToday } from "date-fns";
import { ClipboardCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import {
  getWeekStart,
  getWeekDays,
  formatColumnDate,
  groupTasksByDate,
} from "@/lib/dateFilters";
import { TaskCardCompact, priorityConfig, TaskWithSubtasks } from "../../../../components/task-card/task-card-compact";

interface WeekViewProps {
  tasks: TaskWithSubtasks[];
  weekFrom: string;
  weekTo: string;
  onDelete: (task: Task) => void;
  onRefresh: () => void;
}

function WeekViewInner({
  tasks,
  weekFrom,
  weekTo,
  onDelete,
  onRefresh,
}: WeekViewProps) {
  const weekStart = getWeekStart(new Date(weekFrom + "T00:00:00"));
  const weekDays = getWeekDays(weekStart);
  const today = startOfToday();
  const tasksByDate = useMemo(() => groupTasksByDate(tasks), [tasks]);

  const handleToggle = useCallback(async (taskId: string) => {
    const result = await serverToggleTask(taskId);
    if (result.success) {
      onRefresh();
    }
  }, [onRefresh]);

  return (
    <div className="flex gap-2 w-full h-full">
      {weekDays.map((day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        const dayTasks = tasksByDate.get(dateKey) || [];
        const isToday = isSameDay(day, today);

        return (
          <div
            key={dateKey}
            className={cn(
              "flex flex-col rounded-lg border p-2 min-w-[200px] w-full",
              isToday ? "border-primary bg-primary/5" : "border-border bg-card/30"
            )}
          >
            <h3
              className={cn(
                "text-xs font-medium text-center mb-2 pb-1 border-b shrink-0",
                isToday ? "border-primary text-primary" : "border-border text-muted-foreground"
              )}
            >
              {formatColumnDate(day)}
            </h3>
            {
              dayTasks.length > 0 && (
                <div className="px-2 flex flex-col justify-center items-center py-1 mb-1">
                  <Progress value={(dayTasks.filter((t) => t.completed).length / dayTasks.length) * 100 || 0} className="h-1 mb-1" />
                  <span className="text-foreground/40 text-xs">Completados {dayTasks.filter((t) => t.completed).length}/{dayTasks.length}</span>
                </div>
              )
            }
            <div className="flex-1 space-y-1">
              {dayTasks.length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center opacity-50 h-full flex flex-col items-center justify-center py-2">
                  <ClipboardCheck className="h-4 w-4 mb-1 mx-auto" />
                  Sin tareas
                </p>
              ) : (
                dayTasks.map((task) => {
                  const priority = priorityConfig[task.priority];
                  return (
                    <TaskCardCompact
                      key={task.id}
                      task={task}
                      priority={priority}
                      onToggle={() => handleToggle(task.id)}
                    />
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const WeekView = memo(WeekViewInner);
export type { WeekViewProps };
