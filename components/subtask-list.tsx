import { DragEndEvent } from "@dnd-kit/core";
import { PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SubtaskItem } from "./subtask-item";
import { SubtaskEmptyState } from "./subtask-empty-state";
import { Subtask } from "@/generated/prisma/client";

interface SubtaskListProps {
  items: Subtask[];
  deletingId: string | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (event: DragEndEvent, items: Subtask[]) => void;
}

export function SubtaskList({
  items,
  deletingId,
  onToggle,
  onDelete,
  onReorder,
}: SubtaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (items.length === 0) {
    return <SubtaskEmptyState />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => onReorder(event, items)}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 px-4">
          {items.map((subtask) => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              onToggle={() => onToggle(subtask.id)}
              onDelete={() => onDelete(subtask.id)}
              isDeleting={deletingId === subtask.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
