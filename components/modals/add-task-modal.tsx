"use client";

import { createTask } from "@/app/actions/createTask";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Flag, Plus, Clock, Timer } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PopoverTrigger, Popover, PopoverContent } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Switch } from "../ui/switch";
import { useSession } from "next-auth/react";

const addTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "El título es requerido")
      .max(200, "El título debe tener máximo 200 caracteres"),
    dueDate: z.union([z.undefined(), z.date()]),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]),
    usePomodoro: z.boolean(),
  })
  .refine((data) => data.dueDate !== undefined, {
    message: "La fecha límite es requerida",
    path: ["dueDate"],
  })
  .refine(
    (data) =>
      data.dueDate === undefined ||
      data.dueDate >= new Date(new Date().setHours(0, 0, 0, 0)),
    {
      message: "La fecha límite no puede ser en el pasado",
      path: ["dueDate"],
    }
  )
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

type AddTaskFormData = z.infer<typeof addTaskSchema>;

export default function AddTaskModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTaskFormData>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      dueDate: new Date(),
      startTime: "",
      endTime: "",
      priority: "medium",
      usePomodoro: true,
    },
  });

  const handleClose = () => {
    setIsOpen(false);
    reset({ title: "", dueDate: new Date(), startTime: "", endTime: "", priority: "medium", usePomodoro: true });
  };

  const onSubmit = async (data: AddTaskFormData) => {
    if (!data.dueDate) return;

    if (session) {
      const formData = new FormData();
      formData.set("title", data.title);
      formData.set("dueDate", data.dueDate.toISOString());
      formData.set("priority", data.priority);
      formData.set("usePomodoro", data.usePomodoro.toString());
      
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

      const result = await createTask(formData);
      if (result.success) {
        toast.success("Tarea creada");
        handleClose();
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed w-14 h-14 bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        variant='outline'
        size='icon'
      >
        <Plus className="h-5 w-5" />
      </Button>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={handleClose} title="Nueva Tarea">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Crea una tarea y organiza tu trabajo
          </p>

          {/* Title */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-foreground"
            >
              Título
            </Label>
            <Input
              id="title"
              placeholder="Ej: Deploy portfolio"
              className="bg-input border-input text-foreground placeholder:text-muted-foreground focus:border-ring focus:bg-input/80"
              {...register("title")}
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
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
                    <Input
                      type="time"
                      {...field}
                      className="bg-background border-input text-foreground focus:border-ring focus:bg-background/80 h-9"
                    />
                  )}
                />
              </div>
              <span className="text-muted-foreground text-sm">a</span>
              <div className="flex-1">
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="time"
                      {...field}
                      className="bg-background border-input text-foreground focus:border-ring focus:bg-background/80 h-9"
                    />
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
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
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

          {/* Pomodoro Switch */}
          <Controller
            name="usePomodoro"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border/50">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2 cursor-pointer">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  Tiempos de descanso
                </Label>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors mt-6"
          >
            {isSubmitting ? "Creando…" : "Crear tarea"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
