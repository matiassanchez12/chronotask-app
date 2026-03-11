import { Card } from "./ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  variant?: "cyan" | "green" | "amber" | "rose" | "violet";
}

const variantStyles = {
  cyan: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
};

const iconBgStyles = {
  cyan: "bg-cyan-500/20",
  green: "bg-green-500/20",
  amber: "bg-amber-500/20",
  rose: "bg-rose-500/20",
  violet: "bg-violet-500/20",
};

export default function StatCard({ title, value, icon, variant = "cyan" }: StatCardProps) {
  return (
    <Card className="rounded-xl border bg-card/50 hover:bg-card/80 transition-colors duration-200 group">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${iconBgStyles[variant]} group-hover:scale-110 transition-transform duration-200`}>
            {icon}
          </div>
          <span className="text-2xl font-bold tracking-tight">{value}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-3 font-medium">{title}</p>
      </div>
    </Card>
  );
}
