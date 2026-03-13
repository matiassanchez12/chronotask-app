export interface LocalTask {
  id: string;
  title: string;
  dueDate: string;
  startTime: string | null;
  endTime: string | null;
  priority: string;
  completed: boolean;
  workTimeMinutes: number;
  breakTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_TASKS_KEY = "localTasks";

export function getLocalTasks(): LocalTask[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

export function createLocalTaskData(
  title: string,
  dueDate: Date,
  priority: string,
  usePomodoro: boolean,
  startTime?: string,
  endTime?: string
): Omit<LocalTask, "id" | "completed" | "workTimeMinutes" | "breakTimeMinutes" | "createdAt" | "updatedAt"> {
  const task: any = {
    title,
    dueDate: dueDate.toISOString(),
    priority,
    startTime: null,
    endTime: null,
  };

  if (startTime) {
    const date = new Date(dueDate);
    const [h, m] = startTime.split(":");
    date.setHours(parseInt(h), parseInt(m), 0, 0);
    task.startTime = date.toISOString();
  }

  if (endTime) {
    const date = new Date(dueDate);
    const [h, m] = endTime.split(":");
    date.setHours(parseInt(h), parseInt(m), 0, 0);
    task.endTime = date.toISOString();
  }

  return task;
}

export function saveLocalTask(task: Omit<LocalTask, "id" | "completed" | "workTimeMinutes" | "breakTimeMinutes" | "createdAt" | "updatedAt">): LocalTask {
  const tasks = getLocalTasks();
  const now = new Date().toISOString();
  const newTask: LocalTask = {
    ...task,
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    completed: false,
    workTimeMinutes: 0,
    breakTimeMinutes: 0,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
  return newTask;
}

export function updateLocalTask(id: string, updates: Partial<LocalTask>): LocalTask | null {
  if (typeof window === "undefined") return null;
  const tasks = getLocalTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
  return tasks[index];
}

export function deleteLocalTask(id: string): boolean {
  if (typeof window === "undefined") return false;
  const tasks = getLocalTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(filtered));
  return true;
}

export function toggleLocalTask(id: string): LocalTask | null {
  const task = getLocalTasks().find((t) => t.id === id);
  if (!task) return null;
  return updateLocalTask(id, { completed: !task.completed });
}

export function getLocalTaskById(id: string): LocalTask | null {
  return getLocalTasks().find((t) => t.id === id) || null;
}
