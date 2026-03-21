import { Check } from "lucide-react";

interface SubtaskCheckboxProps {
  checked: boolean;
  onToggle: () => void;
}

export function SubtaskCheckbox({ checked, onToggle }: SubtaskCheckboxProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked
          ? "bg-primary border-primary"
          : "border-muted-foreground/30 hover:border-primary"
      }`}
    >
      {checked && <Check className="h-3 w-3 text-primary-foreground" />}
    </button>
  );
}
