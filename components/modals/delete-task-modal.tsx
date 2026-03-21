"use client";

import { deleteTask } from "@/app/actions/deleteTask";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface DeleteTaskModalProps {
  taskId: string;
  taskTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteTaskModal({
  taskId,
  taskTitle,
  isOpen,
  onClose,
}: DeleteTaskModalProps) {
  const handleConfirmDelete = async () => {
    const result = await deleteTask(taskId);
    if (result.success) {
      toast.success("Task deleted");
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar tarea">
      <p className="text-muted-foreground mb-6">
        ¿Estás seguro de que quieres eliminar &quot;{taskTitle}&quot;? Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
          Eliminar
        </Button>
      </div>
    </Modal>
  );
}
