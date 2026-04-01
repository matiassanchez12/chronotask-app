"use client";

import { useState } from "react";
import { ListTodo, Workflow } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SubtaskList } from "./subtask-list";
import { SubtaskForm } from "./subtask-form";
import {
  createSubtask,
  toggleSubtask,
  deleteSubtask,
  reorderSubtasks,
} from "@/app/actions/subtasks";
import { Task, Subtask } from "@/generated/prisma/client";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { Button } from "./ui/button";

interface SubtaskSheetProps {
  task: Task;
  subtasks: Subtask[];
  buttonText?: string;  
  buttonClasses?: string;
}

export default function SubtaskSheet({
  task,
  subtasks,
  buttonText,
  buttonClasses,
}: SubtaskSheetProps) {
  const [open, setOpen] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleReorder = async (event: DragEndEvent, currentItems: Subtask[]) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = currentItems.findIndex((i) => i.id === active.id);
    const newIndex = currentItems.findIndex((i) => i.id === over.id);
    const newItems = arrayMove(currentItems, oldIndex, newIndex);

    const result = await reorderSubtasks(
      task.id,
      newItems.map((i) => i.id)
    );
    if (!result.success) {
      toast.error(result.error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    setIsAdding(true);
    try {
      const result = await createSubtask(task.id, newDescription.trim());
      
      if (!result.success) {
        toast.error(result.error || "Error al agregar");
      }
    } finally {
      setNewDescription("");
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: string) => {
    const result = await toggleSubtask(id);

    if (!result.success) {
      toast.error(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result = await deleteSubtask(id);
      
      if (!result.success) {
        toast.error(result.error);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`gap-2 text-muted-foreground border-primary/30 hover:bg-primary/10 ${buttonClasses}`}
      >
        <Workflow className="h-4 w-4" />
        {buttonText}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[400px] sm:max-w-[400px] flex flex-col">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Checklist
            </SheetTitle>
            <SheetDescription className="truncate">
              {task.title}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-2">
            <SubtaskList
              items={subtasks}
              deletingId={deletingId}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </div>

          <SubtaskForm
            value={newDescription}
            onChange={setNewDescription}
            onSubmit={handleAdd}
            isAdding={isAdding}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
