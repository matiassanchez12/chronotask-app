import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Target, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            Tododoro
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
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
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8">
                  Comenzar gratis
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              ¿Por qué usar Tododoro?
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

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">
              ¿Listo para aumentar tu productividad?
            </h2>
            <p className="text-lg text-muted-foreground">
              Únete a miles de usuarios que ya están organizando mejor su tiempo
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8">
                Crear cuenta gratis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2026 Tododoro. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
