# ChonoTask

## Next js FE
## Server Actions BE
## Shadcn UI
## Prisma SQL DB
## NextAuth Auth

## TODO List

- [x] Crear esquemas iniciales de Prisma
- [x] Planificar próximos features y prioridades
- [x] Integrar NextAuth para autenticación
- [x] Crear primeras páginas protegidas/autenticadas
- [x] Desarrollar los primeros componentes UI con Shadcn
- [x] Configurar entorno de desarrollo local
- [x] Definir la arquitectura de carpetas del proyecto
- [] una tarea puede definir si tiene o no el contador pomodoro activado 
- [] si hay tasks para hoy mostrarlo en una card
- [] Recomendaciones de productividad con ai, si hay muchas tareas en simultaneo proponer alternativas mas sanas para organizar sus tareas
- [] Permitir usuarios sin cuenta
- [] Hacer un arbol de tareas. Las tareas se pueden relacionar entre si, y pertenecer a una tarea mas grande, es decir, ser subtareas de una tarea. Esta propiedad de la tarea se podra seleccionar en los formularios de creacion
Para una mejor visualizacion de objetivos, se podra ver estas relaciones de tarea en una interfaz para que el usuario vea sus tareas y progresos en las mismas 
- [] agregar tips de productividad y cuidado de stress

Proximas app
- [] Study Management
- [] Restaurant Menu App
---

## Roadmap / Próximos features

Orden sugerido por dependencias y valor. Ajusta prioridad (P1 = urgente, P2 = importante, P3 = cuando haya tiempo).

| Prioridad | Feature | Notas / dependencias |
|-----------|---------|----------------------|
| P1 | Esquemas Prisma + migraciones | DB lista antes de más features | 
| P1 | Crear pagina configuraciones - Secciones: Eliminar cuenta | Configurar pomodoro time | configuracion para Boton eliminar de cardtask: mostrar modal de confirmacion o no |
| P2 | Páginas protegidas | Después de NextAuth |
| P3 | Pruebas de flujo auth | Cuando el flujo esté estable |
| P3 | Otros features | Ej: filtros avanzados, export, etc. |
| P3 | Modes | Ej: Pomodoro mode, todo mode. Darkmode, Lightmode |
| P3 | Integrar wpp api, para recordatorios de alguna task | buscar alguna api free. [nocreo que exista] |
| P3 | en lugar de wpp api usar las notificaciones de chrome |
| P3 | Se crea el counter section |
| P3 | Que tiene la app de pomodoro? si bien va a tener un contador con el tiempo que se le lleva dedicando a la tarea actual, eso no es pomodoro. 
Para que se use el concepto de pomodoro, la app tendria que aplicar un contador que se ejecute cada cierto tiempo y sirva como una pausa de descanso. 
Ese cierto tiempo sera configurable por el usuario. Y cuando la tarea se este ejecutando el usuario tendra la posibilidad de elegir que el modo pomodoro se active o no|



**Cómo usar este roadmap**

1. **Corto plazo (esta semana):** elige 1–2 ítems P1 y ponlos en tu TODO.
2. **Mediano plazo (este mes):** revisa la tabla y mueve ítems según lo que ya terminaste.
3. **Ideas nuevas:** añádelas abajo con prioridad P3 y luego sube a P2/P1 si las quieres hacer pronto.
