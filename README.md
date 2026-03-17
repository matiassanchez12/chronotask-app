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
- [x] una tarea puede definir si tiene o no el contador pomodoro activado 
- [x] si hay tasks para hoy mostrarlo en una card
- [x] Recomendaciones de productividad con ai, si hay muchas tareas en simultaneo proponer alternativas mas sanas para organizar sus tareas
- [x] Permitir usuarios sin cuenta
- [x] agregar tips de productividad y cuidado de stress
- [x] card tareas para hoy
- [x] los fines de semanas, mostrar en el dashboard un card que diga las tareas de esta semana
- [] Hacer un arbol de tareas. Las tareas se pueden relacionar entre si, y pertenecer a una tarea mas grande, es decir, ser subtareas de una tarea. Esta propiedad de la tarea se podra seleccionar en los formularios de creacion
Para una mejor visualizacion de objetivos, se podra ver estas relaciones de tarea en una interfaz para que el usuario vea sus tareas y progresos en las mismas.
En lugar de mostrar el progreso de la task con numeros, mostrarlo con un border al rededor verde que se vaya completando segun pasa el tiempo
- [] agregar opcion rutina. Crear tabla rutine, la rutina tendra 3 datos: dia(nombre, lunes martes etc), horario(opcional), perioricidad(cada 1 semana, cada 15 dias, cada 1 mes, 1 año),

-- Modulo visualizar tareas en nodos
1. Propósito
Crear un módulo que permita visualizar las tareas de una forma mas amable para el usuario.
2. Funcionalidad
- Mostrar tareas en forma de nodos
- Mantener la ui de las cards de la pagina manage, o ver si se puede hacer algo mas acorde al modulo
- Las cards estaran relacionadas entre si mediante flechas o lineas, esa relacion se basa en el atributo idParent
- Cada card, en caso de estar en el rango de horario de actividad, tendra un borde verde que simulara el avance el tiempo.
- Al clickear una card, se podra ver el tiempo que le queda para concluir y ademas, un recuadro con las cards que son sus hijas o padres
3. Interfaz/API
interface Task {
  parentId: string // agregar
}
- actualizar endpoints de backend
- actualizar modelos de db y prisma
4. Estructura de archivos
src/
  components/
    Diagrams.tsx
5. Dependencias
- libreria de diagramas
6. Persistencia
- API REST - gettasks
7. Casos edge a manejar
- Persistencia ante refresh

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
| P3 | Que tiene la app de pomodoro? si bien va a tener un contador con el tiempo que se le lleva dedicando a la tarea actual, eso no es pomodoro. Para que se use el concepto de pomodoro, la app tendria que aplicar un contador que se ejecute cada cierto tiempo y sirva como una pausa de descanso.

**Cómo usar este roadmap**

1. **Corto plazo (esta semana):** elige 1–2 ítems P1 y ponlos en tu TODO.
2. **Mediano plazo (este mes):** revisa la tabla y mueve ítems según lo que ya terminaste.
3. **Ideas nuevas:** añádelas abajo con prioridad P3 y luego sube a P2/P1 si las quieres hacer pronto.
