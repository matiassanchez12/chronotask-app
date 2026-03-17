export interface LocalTask {
  id: string;
  title: string;
  dueDate: Date;
  startTime: Date | null;
  endTime: Date | null;
  priority: string;
  completed: boolean;
  workTimeMinutes: number | null;
  breakTimeMinutes: number | null;
  usePomodoro: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

const LOCAL_TASKS_KEY = "localTasks";
const USER_ID_KEY = "userId";

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function serializeDate(date: Date | null): string | null {
  return date ? date.toISOString() : null;
}

function reviveDates(tasks: LocalTask[]): LocalTask[] {
  return tasks.map((task) => {
    const dueDate = parseDate(task.dueDate as unknown as string);
    return {
      ...task,
      dueDate: dueDate ?? new Date(),
      startTime: parseDate(task.startTime as unknown as string),
      endTime: parseDate(task.endTime as unknown as string),
      createdAt: parseDate(task.createdAt as unknown as string) ?? new Date(),
      updatedAt: parseDate(task.updatedAt as unknown as string) ?? new Date(),
    };
  });
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function setUserId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ID_KEY, id);
}

export function getLocalTasks(): LocalTask[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_TASKS_KEY);
  const tasks = data ? JSON.parse(data) : [];
  return reviveDates(tasks);
}

export function createLocalTaskData(
  title: string,
  dueDate: Date,
  priority: string,
  usePomodoro: boolean,
  startTime?: string,
  endTime?: string
): Omit<LocalTask, "completed" | "workTimeMinutes" | "breakTimeMinutes" | "createdAt" | "updatedAt"> {
  const userId = getUserId();
  if (!userId) {
    throw new Error("User ID not found in localStorage. Please set it first.");
  }
  
  const task: Partial<LocalTask> = {
    title,
    dueDate,
    priority,
    usePomodoro,
    startTime: null,
    endTime: null,
    userId,
  };

  if (startTime) {
    const date = new Date(dueDate);
    const [h, m] = startTime.split(":");
    date.setHours(parseInt(h), parseInt(m), 0, 0);
    task.startTime = date;
  }

  if (endTime) {
    const date = new Date(dueDate);
    const [h, m] = endTime.split(":");
    date.setHours(parseInt(h), parseInt(m), 0, 0);
    task.endTime = date;
  }

  return {
    ...task,
  } as Omit<LocalTask, "completed" | "workTimeMinutes" | "breakTimeMinutes" | "createdAt" | "updatedAt">;
}

export function saveLocalTask(
  task: Omit<LocalTask, "completed" | "workTimeMinutes" | "breakTimeMinutes" | "createdAt" | "updatedAt">
): LocalTask {
  const tasks = getLocalTasks();
  const now = new Date();
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
  const serialized = tasks.map((t) => ({
    ...t,
    dueDate: serializeDate(t.dueDate),
    startTime: serializeDate(t.startTime),
    endTime: serializeDate(t.endTime),
    createdAt: serializeDate(t.createdAt),
    updatedAt: serializeDate(t.updatedAt),
  }));
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(serialized));
  return newTask;
}

export function updateLocalTask(id: string, updates: Partial<LocalTask>): LocalTask | null {
  if (typeof window === "undefined") return null;
  const tasks = getLocalTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  const now = new Date();
  tasks[index] = { ...tasks[index], ...updates, updatedAt: now };
  
  const serialized = tasks.map((t) => ({
    ...t,
    dueDate: serializeDate(t.dueDate),
    startTime: serializeDate(t.startTime),
    endTime: serializeDate(t.endTime),
    createdAt: serializeDate(t.createdAt),
    updatedAt: serializeDate(t.updatedAt),
  }));
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(serialized));
  return tasks[index];
}

export function deleteLocalTask(id: string): boolean {
  if (typeof window === "undefined") return false;
  const tasks = getLocalTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  
  const serialized = filtered.map((t) => ({
    ...t,
    dueDate: serializeDate(t.dueDate),
    startTime: serializeDate(t.startTime),
    endTime: serializeDate(t.endTime),
    createdAt: serializeDate(t.createdAt),
    updatedAt: serializeDate(t.updatedAt),
  }));
  localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(serialized));
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
