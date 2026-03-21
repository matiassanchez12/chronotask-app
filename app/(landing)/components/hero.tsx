import { Button } from "@/components/ui/button";
import { Target, Clock, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Hero () {
  return <main>
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-bold tracking-tight">
              Gestiona tus tareas con{" "}
              <span className="text-primary">Pomodoro</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Una aplicación simple y efectiva para organizar tu trabajo. 
              Combina la técnica Pomodoro con gestión de tareas para maximizar tu productividad.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/admin">
                <Button size="lg" className="text-lg px-8">
                  Probar ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Por qué usar ChonoTask?
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Gestión de tareas</h3>
                <p className="text-muted-foreground">
                  Crea, organiza y prioriza tus tareas de forma simple y eficiente
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Técnica Pomodoro</h3>
                <p className="text-muted-foreground">
                  Trabaja en intervalos de 25 minutos con descansos estratégicos
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Productividad</h3>
                <p className="text-muted-foreground">
                  Mantén el enfoque y aumenta tu rendimiento diario
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Seguimiento</h3>
                <p className="text-muted-foreground">
                  Visualiza tu progreso y celebra tus logros
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>;
};