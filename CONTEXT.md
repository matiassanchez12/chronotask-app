# Contexto del Proyecto - Dev Dashboard

## Información General

- **Proyecto**: Next.js 16 con TypeScript, App Router, shadcn/ui, Tailwind CSS v4, Prisma con PostgreSQL
- **Fecha actual**: Domingo 8 de Marzo 2026
- **Interfaz en**: Español

## Estructura de Componentes

### Componentes Principales

| Archivo | Descripción |
|---------|-------------|
| `app/admin/page.tsx` | Página principal con filtros, modo toggle y lista de tareas |
| `app/actions/completeTask.ts` | Server action para marcar tareas como completadas |
| `app/actions/updateTaskTime.ts` | Server action para actualizar tiempos de tarea |
| `components/header.tsx` | Header con fecha y hora en tiempo real |
| `components/filters.tsx` | Filtros de fecha (Hoy, Mañana, Semana, Mes, Todas) |
| `components/tasks.tsx` | Lista de tareas (soporta modo counter) |
| `components/taskCard.tsx` | Tarjeta individual de tarea |
| `components/modeToggle.tsx` | Toggle Counter/Todo mode |
| `components/counter.tsx` | Componente counter con lógica Pomodoro |
| `components/addTaskModal.tsx` | Modal para crear tareas |
| `components/editTaskDialog.tsx` | Dialog para editar tareas |
| `components/deleteTaskModal.tsx` | Modal para eliminar tareas |

### Componentes UI (shadcn/ui)

| Componente | Uso |
|------------|-----|
| `ui/button.tsx` | Botones |
| `ui/badge.tsx` | Badges de prioridad |
| `ui/modal.tsx` | Modales |
| `ui/dialog.tsx` | Dialogs |
| `ui/tabs.tsx` | Tabs |
| `ui/input.tsx` | Inputs |
| `ui/select.tsx` | Selects |
| `ui/calendar.tsx` | Calendario |
| `ui/popover.tsx` | Popovers |
| `ui/card.tsx` | Cards |
| `ui/chart.tsx` | Gráficos |
| `ui/label.tsx` | Labels |

## Modelo de Datos

### User (Prisma)

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

### UserSettings (Prisma)

```prisma
model UserSettings {
  id                  String  @id @default(cuid())
  userId              String  @unique
  pomodoroDuration    Int     @default(25)    // minutos de trabajo
  shortBreakDuration  Int     @default(5)     // minutos de descanso corto
  longBreakDuration   Int     @default(15)    // minutos de descanso largo
  confirmBeforeDelete Boolean @default(true)
  fontSize            Int     @default(16)
  user                User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Task (Prisma)

```prisma
model Task {
  id        String    @id @default(cuid())
  title     String
  dueDate   DateTime
  startTime DateTime?  // Hora de inicio de la tarea
  endTime   DateTime?  // Hora de fin de la tarea
  priority  String    @default("medium")  // "high", "medium", "low"
  completed Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Tareas Realizadas

### 1. Header con fecha y hora en tiempo real
- Formato fecha: "Jueves 6 de Marzo 2026"
- Formato hora: "02:30 PM" (se actualiza cada segundo)
- Capitalización correcta (excepto "de")

### 2. TaskCard mejorado
- Badge de prioridad usando shadcn/ui (Alta/Media/Baja)
- Fechas en español con iconos Calendar/Clock
- Mejor jerarquía visual
- Efectos hover sutiles

### 3. DeleteTaskModal separado
- Archivo: `components/deleteTaskModal.tsx`
- Interfaz tipada con props

### 4. ModeToggle
- Toggle Counter/Todo en `app/admin/page.tsx`
- Estilo similar a dark mode toggle
- Si hay tareas activas, se muestra automáticamente en modo Counter
- El botón Todo se deshabilita cuando hay tareas activas

### 5. Counter/Pomodoro Mode
- Componente `counter.tsx` con lógica completa de Pomodoro
- Detección automática de tareas activas (startTime - endTime)
- Ciclos de trabajo/descanso basados en configuración de usuario
- Barras de progreso visuales (trabajo + descanso)
- Botón "Avanzar" para saltar fases y actualizar tiempo de tarea
- Auto-completar tarea cuando terminan todos los pomodoros

### 6. Tipos TypeScript
- Interfaz `Task` importada de `@/generated/prisma/client`
- Interfaz `PomodoroSettings` y `Phase` en counter.tsx
- Props tipadas en todos los componentes

## Scripts npm

```json
{
  "d": "next dev",
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

Ejecutar: `npm run dev` para desarrollo

## Errores de Lint (preexistentes)

- `editTaskDialog.tsx:84-123` - Componente creado durante render
- `lib/auth.ts:54,81` - Tipos `any`
- `middleware.ts:6` - Tipo `any`
