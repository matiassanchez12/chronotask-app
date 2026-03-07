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
