import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import { SubtaskCheckbox } from "./subtask-checkbox";
import { Subtask } from "@/generated/prisma/client";

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function SubtaskItem({ subtask, onToggle, onDelete, isDeleting }: SubtaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtask.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-grab active:cursor-grabbing select-none"
    >
      <SubtaskCheckbox checked={subtask.completed} onToggle={onToggle} />

      <span
        className={`flex-1 text-sm ${
          subtask.completed ? "line-through text-muted-foreground" : ""
        }`}
      >
        {subtask.description}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 rounded hover:bg-destructive/10 hover:text-destructive transition-all disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
