import TaskCard from "./taskCard";
import { Task } from "@/generated/prisma/client";

export default function Tasks({ tasks }: { tasks: Task[] }) {
    return (
        <div className="space-y-3 sm:space-y-4">
            {tasks.length === 0 && (
                <p className="text-muted-foreground text-sm">No hay tareas en este rango.</p>
            )}

            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    )
}
