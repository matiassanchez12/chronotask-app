import { ListTodo } from "lucide-react";

export function SubtaskEmptyState() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-30" />
      <p className="text-sm">No se encontraron datos</p>
      <p className="text-xs mt-1 opacity-70">
        Agrega una para organizar mejor tu tarea
      </p>
    </div>
  );
}
