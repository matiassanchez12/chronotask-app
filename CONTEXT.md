# Contexto del Proyecto - Dev Dashboard

## Información General

- **Proyecto**: Next.js 16 con TypeScript, App Router, shadcn/ui, Tailwind CSS v4, Prisma con PostgreSQL
- **Fecha actual**: Viernes 6 de Marzo 2026
- **Interfaz en**: Español

## Estructura de Componentes

### Componentes Principales

| Archivo | Descripción |
|---------|-------------|
| `app/page.tsx` | Página principal con filtros, modo toggle y lista de tareas |
| `components/header.tsx` | Header con fecha actual formateada en español |
| `components/filters.tsx` | Filtros de fecha (Hoy, Mañana, Semana, Mes, Todas) |
| `components/tasks.tsx` | Lista de tareas |
| `components/taskCard.tsx` | Tarjeta individual de tarea |
| `components/modeToggle.tsx` | Toggle Pomodoro/Todo mode |
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

### Task (Prisma)

```prisma
model Task {
  id        String   @id @default(cuid())
  title     String
  dueDate   DateTime
  priority  String   @default("medium")  // "high", "medium", "low"
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Tareas Realizadas

### 1. Header con fecha en español
- Formato: "Jueves 6 de Marzo 2026"
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
- Toggle Pomodoro/Todo en `page.tsx`
- Estilo similar a dark mode toggle
- Usa props del server component (searchParams como Promise)

### 5. Tipos TypeScript
- Interfaz `Task` definida en `taskCard.tsx`
- Interfaz `PriorityConfig` y `PriorityVariant`
- Props en `ModeToggle`, `DeleteTaskModal`

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

Ejecutar: `npm d` para desarrollo

## Errores de Lint (preexistentes)

- `editTaskDialog.tsx:17` - `any` type
- `editTaskDialog.tsx:29-37` - Componente creado durante render

## Próximas Mejoras Sugeridas

1. Corregir errores de lint en `editTaskDialog.tsx`
2. Implementar funcionalidad Pomodoro mode
3. Agregar persistencia de modo en localStorage
4. Mejorar validación de formularios
