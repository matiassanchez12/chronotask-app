# AGENTS.md - Developer Guidelines for dev-dashboard

## Project Overview

This is a Next.js 16 application with TypeScript, using the App Router, shadcn/ui components, Tailwind CSS v4, Prisma with PostgreSQL, and Server Actions for mutations.

## Build, Lint, and Test Commands

```bash
# Development
npm run dev          # Start Next.js development server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

**Note:** This project does not currently have a test framework configured (no Vitest, Jest, or testing library). If you add tests, common commands would be:

```bash
# For Vitest (if added)
npm run test         # Run all tests
npm run test -- --run <file>    # Run single test file
npm run test -- --watch         # Watch mode

# For Jest (if added)
npm test             # Run all tests
npm test -- <file>   # Run single test file
```

## Code Style Guidelines

### General Principles

- **No comments** unless explicitly required
- Use TypeScript with strict mode enabled
- Prefer functional components and hooks
- Keep components small and focused

### Imports

Use the `@/` alias for absolute imports (configured in `tsconfig.json`):

```typescript
// Good
import { Button } from "@/components/ui/button";
import { createTask } from "@/app/actions/createTask";
import { cn } from "@/lib/utils";

// Group imports in this order:
// 1. React/Next imports
// 2. External libraries
// 3. @/ imports (components, lib, actions)
// 4. Relative imports
```

### File Naming

- Components: PascalCase (`AddTaskModal.tsx`, `TaskCard.tsx`)
- Actions: camelCase (`createTask.ts`, `toggleTask.ts`)
- Utilities: camelCase (`utils.ts`)
- Config files: kebab-case (`eslint.config.mjs`, `postcss.config.mjs`)

### Component Structure

Follow this pattern for client components:

```typescript
"use client";

import { useState } from "react";
// ... imports

// Schema validation with Zod (at top level)
const schema = z.object({ ... });

type FormData = z.infer<typeof schema>;

export default function ComponentName() {
  // State
  const [state, setState] = useState(...);
  
  // Hooks
  const { ... } = useForm(...);
  
  // Handlers
  const handleAction = async () => { ... };
  
  // Render
  return ( ... );
}
```

### Server Actions

Follow this pattern for server actions:

```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: true } | { success: false; error: string };

export async function actionName(formData: FormData): Promise<ActionResult> {
  try {
    // Validation
    const value = formData.get("value");
    if (!value) return { success: false, error: "Value is required" };
    
    // Database operation
    await prisma.model.create({ data: { ... } });
    
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("actionName:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to perform action",
    };
  }
}
```

### TypeScript

- Enable strict mode in `tsconfig.json`
- Use `type` for simple type aliases, `interface` for object shapes
- Use Zod for runtime validation
- Prefer inference over explicit types when obvious

### Error Handling

- Use try/catch in server actions
- Return typed `ActionResult` union (`{ success: true }` | `{ success: false; error: string }`)
- Use `sonner` (toast) for user-facing notifications
- Log errors with context: `console.error("actionName:", e)`

### Styling

- Use Tailwind CSS v4 with `@tailwindcss/postcss`
- Use shadcn/ui component patterns (see `components.json` for aliases)
- Use CSS variables from `app/globals.css` (e.g., `bg-primary`, `text-foreground`)
- Use `cn()` utility for conditional classes: `cn("base-class", condition && "conditional-class")`

### Database (Prisma)

- Prisma client is in `lib/prisma.ts`
- Schema is in `prisma/schema.prisma`
- Generated client output: `src/generated/prisma`

### UI Components

- UI components are in `components/ui/`
- Use shadcn/ui conventions (style: "new-york", iconLibrary: "lucide")
- Components use Radix UI primitives under the hood

### Paths Aliases

Configured in `tsconfig.json`:

| Alias   | Path         |
|---------|--------------|
| `@/*`   | `./*`        |
| `@/components` | `./components` |
| `@/lib` | `./lib`      |
| `@/app` | `./app`      |
| `@/components/ui` | `./components/ui` |

## Additional Notes

- UI text is in Spanish (e.g., "Nueva Tarea", "Título") but code is in English
- This is a task management dashboard with filtering by date range
- Uses Next.js 16.1.6 with React 19
- Main page: `app/admin/page.tsx`

## Database Models (Prisma Schema)

### User

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
  settings  UserSettings?
}
```

### UserSettings

```prisma
model UserSettings {
  id                  String  @id @default(cuid())
  userId              String  @unique
  pomodoroDuration    Int     @default(25)
  shortBreakDuration  Int     @default(5)
  longBreakDuration   Int     @default(15)
  confirmBeforeDelete Boolean @default(true)
  fontSize            Int     @default(16)
  user                User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Task

```prisma
model Task {
  id               String    @id @default(cuid())
  title            String
  dueDate          DateTime
  startTime        DateTime?
  endTime          DateTime?
  priority         String    @default("medium")
  completed        Boolean   @default(false)
  workTimeMinutes  Int?      @default(0)
  breakTimeMinutes Int?      @default(0)
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  userId           String
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Counter/Pomodoro Feature

### Overview

The counter mode displays active tasks with a Pomodoro-style timer. It automatically tracks work/break sessions based on user settings.

### User Settings

User settings are stored in `UserSettings` model:
- `pomodoroDuration`: work session length in minutes (default: 25)
- `shortBreakDuration`: break session length in minutes (default: 5)
- `longBreakDuration`: long break session length (default: 15)

### Files

| File | Purpose |
|------|---------|
| `components/counter.tsx` | Main counter component with Pomodoro logic |
| `components/modeToggle.tsx` | Toggle between counter and todo modes |
| `app/admin/page.tsx` | Passes settings and detects active tasks |
| `app/actions/completeTask.ts` | Marks task as completed |
| `app/actions/updateTaskTime.ts` | Updates task start/end times |

### Features

1. **Active Task Detection**: Automatically switches to counter mode when a task is within its scheduled time (`startTime` - `endTime`)

2. **Work/Break Cycles**: 
   - Calculates number of pomodoros based on task duration and settings
   - Alternates between work (primary color) and break (green) phases
   - Automatically transitions between phases
   - Long break (15 min) after every 4 pomodoros

3. **Visual Progress Bars**:
   - Each pomodoro shows two segments: work (primary) + break (green)
   - Width proportional to configured durations
   - Animated pulse on current segment

4. **Advance Button**:
   - Advances to next phase without modifying task schedule
   - Adds remaining time of current phase to accumulated time
   - Completes task if it's the last phase

5. **Auto-Complete**:
   - When all pomodoros complete, task is automatically marked as completed
   - Saves total work time and break time to database

6. **Task Card Status**:
   - Shows "En proceso" badge (amber) for active tasks in todo mode
   - Only shows for uncompleted tasks within their scheduled time

### Key Implementation Details

- Counter uses `useMemo` for calculations to avoid unnecessary re-renders
- Timer updates every second via `setInterval`
- Phase detection based on current time vs pomodoro start/end times
- Active tasks filtered from all user tasks in real-time
- Completed tasks are excluded from counter view
- Advance button does NOT modify task schedule times
- `accumulatedTime` state resets when changing to a different task
- `completedTaskId` resets when changing tasks
- Helper functions (`getPhaseColor`, `getPhaseIcon`, `getPhaseLabel`) are defined outside the component

---

## Recent Changes (Session Notes)

### Mode Toggle
- User can manually switch to "todo" mode even when there are active tasks
- Default behavior: counter if active tasks exist, otherwise todo
- File: `components/modeToggle.tsx`

### Task Card
- Shows amber "En proceso" badge when task is active (within scheduled time and not completed)
- File: `components/taskCard.tsx`

### Time Input
- Both create and edit task forms now use `Input type="time"` instead of Select
- Allows manual entry in addition to selection
- Files: `components/addTaskModal.tsx`, `components/editTaskDialog.tsx`

### Prisma
- Added `workTimeMinutes` and `breakTimeMinutes` fields to Task model
- Migration applied: `20260308183704_add_work_break_times`
- `completeTask` action now accepts optional `workTimeMinutes` and `breakTimeMinutes` parameters
