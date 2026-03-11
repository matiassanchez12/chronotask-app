import { BarChart3, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default async function StatisticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/10">
          <Construction className="w-10 h-10 text-cyan-500" />
        </div>
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="text-muted-foreground max-w-md">
          Estamos trabajando para traerte una experiencia completa de análisis de tu productividad.
          Muy pronto podrás ver tus estadísticas de tareas y pomodoros.
        </p>
      </div>

      <Card className="w-full max-w-md border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 text-muted-foreground">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm">Próximamente: gráficos de productividad, tiempo de focus, rachas y más</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
