"use client";

import { useState, ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateTask } from "@/app/actions/updateTask";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag, Clock } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PopoverTrigger, Popover, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Task } from "@/generated/prisma/client";

interface EditTaskDialogProps {
  task: Task;
  trigger?: ReactNode;
}

const editTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "El título es requerido")
      .max(200, "El título debe tener máximo 200 caracteres"),
    dueDate: z.union([z.undefined(), z.date()]),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]),
  })
  .refine((data) => data.dueDate !== undefined, {
    message: "La fecha límite es requerida",
    path: ["dueDate"],
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return data.startTime < data.endTime;
    },
    {
      message: "La hora de fin debe ser mayor a la hora de inicio",
      path: ["endTime"],
    }
  );

type EditTaskFormData = z.infer<typeof editTaskSchema>;

export default function EditTaskDialog({ task, trigger }: EditTaskDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTaskFormData>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: task.title,
      dueDate: new Date(task.dueDate),
      startTime: task.startTime ? format(new Date(task.startTime), "HH:mm") : "",
      endTime: task.endTime ? format(new Date(task.endTime), "HH:mm") : "",
      priority: task.priority as "low" | "medium" | "high",
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset({
      title: task.title,
      dueDate: new Date(task.dueDate),
      startTime: task.startTime ? format(new Date(task.startTime), "HH:mm") : "",
      endTime: task.endTime ? format(new Date(task.endTime), "HH:mm") : "",
      priority: task.priority as "low" | "medium" | "high",
    });
  };

  const TriggerElement = () => (
    <div onClick={() => setIsOpen(true)} className="cursor-pointer">
      {trigger || <Button size="sm" variant="outline">Editar</Button>}
    </div>
  );

  const onSubmit = async (data: EditTaskFormData) => {
    if (!data.dueDate) return;

    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("dueDate", data.dueDate.toISOString());
    formData.set("priority", data.priority);

    if (data.startTime) {
      const startDateTime = new Date(data.dueDate);
      const [hours, minutes] = data.startTime.split(":");
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      formData.set("startTime", startDateTime.toISOString());
    }

    if (data.endTime) {
      const endDateTime = new Date(data.dueDate);
      const [hours, minutes] = data.endTime.split(":");
      endDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      formData.set("endTime", endDateTime.toISOString());
    }

    const result = await updateTask(task.id, formData);
    if (result.success) {
      toast.success("Task updated");
      handleClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <TriggerElement />

      <Modal isOpen={isOpen} onClose={handleClose} title="Editar tarea">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Actualiza los detalles de tu tarea
          </p>

          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Título
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  id="title"
                  placeholder="Ej: Deploy portfolio"
                  className="bg-input border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-input/80"
                  {...field}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Fecha límite
            </Label>
            <Controller
              name="dueDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" type="button">
                      {field.value
                        ? format(field.value, "PPP", { locale: es })
                        : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          {/* Time Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Horario
            </Label>
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
              <div className="flex-1">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background border-input text-foreground focus:border-ring focus:bg-background/80 h-9">
                        <SelectValue placeholder="Inicio" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border max-h-60">
                        {Array.from({ length: 48 }).map((_, i) => {
                          const hours = Math.floor(i / 2);
                          const minutes = i % 2 === 0 ? "00" : "30";
                          const value = `${hours.toString().padStart(2, "0")}:${minutes}`;
                          return (
                            <SelectItem key={value} value={value} className="text-foreground">
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <span className="text-muted-foreground text-sm">a</span>
              <div className="flex-1">
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-background border-input text-foreground focus:border-ring focus:bg-background/80 h-9">
                        <SelectValue placeholder="Fin" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border max-h-60">
                        {Array.from({ length: 48 }).map((_, i) => {
                          const hours = Math.floor(i / 2);
                          const minutes = i % 2 === 0 ? "00" : "30";
                          const value = `${hours.toString().padStart(2, "0")}:${minutes}`;
                          return (
                            <SelectItem key={value} value={value} className="text-foreground">
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            {errors.endTime && (
              <p className="text-sm text-destructive">{errors.endTime.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              Prioridad
            </Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-input border-input text-foreground focus:border-ring focus:bg-input/80">
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="low" className="text-foreground">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Baja
                      </span>
                    </SelectItem>
                    <SelectItem value="medium" className="text-foreground">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        Media
                      </span>
                    </SelectItem>
                    <SelectItem value="high" className="text-foreground">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Alta
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors mt-6"
          >
            {isSubmitting ? "Guardando…" : "Guardar cambios"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
