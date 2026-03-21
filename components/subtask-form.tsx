import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubtaskFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isAdding: boolean;
}

export function SubtaskForm({ value, onChange, onSubmit, isAdding }: SubtaskFormProps) {
  return (
    <form onSubmit={onSubmit} className="pt-4 pb-4 border-t">
      <div className="flex gap-2 px-4">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Agregar..."
          disabled={isAdding}
          className="flex-1"
        />
        <Button type="submit" disabled={isAdding || !value.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
