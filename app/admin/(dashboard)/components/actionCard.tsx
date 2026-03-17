import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ActionCardProps {
  text: string;
  subtext: string;
  href: string;
  Icon?: React.ReactNode;
  color: "amber" | "teal" | "lime";
}

const colorStyles = {
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hover: "hover:text-amber-400 hover:bg-amber-500/15",
    iconBg: "bg-amber-500/10",
    text: "text-amber-500 dark:text-amber-500/90",
    button: "text-amber-500",
  },
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    hover: "hover:text-teal-400 hover:bg-teal-500/15",
    iconBg: "bg-teal-500/10",
    text: "text-teal-500 dark:text-teal-500/90",
    button: "text-teal-500",
  },
  lime: {
    bg: "bg-lime-500/10",
    border: "border-lime-500/20",
    hover: "hover:text-lime-400 hover:bg-lime-500/15",
    iconBg: "bg-lime-500/10",
    text: "text-lime-500 dark:text-lime-500/90",
    button: "text-lime-500",
  },
}

const ActionCard = ({ text, subtext, href, Icon, color }: ActionCardProps) => {
  const styles = colorStyles[color]

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg border ${styles.bg} ${styles.border} ${styles.hover} group`}
    >
      <div className={`p-1.5 rounded-md ${styles.iconBg} ${styles.text}`}>
        {Icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${styles.text}`}>
          {text}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {subtext}
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className={`${styles.button} gap-1 transition-all duration-200 group-hover:-translate-y-1`}
      >
        Ver
        <ChevronRight className="h-4 w-4" />
      </Button>
    </Link>
  )
}
export default ActionCard;