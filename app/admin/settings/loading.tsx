import Header from "@/components/header";

function AccountSkeleton() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="rounded-2xl border bg-card/60 p-6 space-y-4">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-2xl bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-20 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function TimerSkeleton() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-36 bg-muted rounded animate-pulse" />
        <div className="h-4 w-56 bg-muted rounded animate-pulse" />
      </div>
      <div className="rounded-2xl border bg-card/60 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/30">
              <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-12 w-16 bg-muted rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-10 w-28 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function GoalSkeleton() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-56 bg-muted rounded animate-pulse" />
      </div>
      <div className="rounded-2xl border bg-card/60 p-6 space-y-8">
        <div className="flex flex-col items-center py-4">
          <div className="w-40 h-40 rounded-full bg-muted animate-pulse flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-muted/50 animate-pulse" />
          </div>
          <div className="h-4 w-24 bg-muted rounded animate-pulse mt-4" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded-full animate-pulse" />
          <div className="flex justify-between">
            <div className="h-3 w-4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-4 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {[5, 10, 15, 20, 25, 30].map((n) => (
            <div key={n} className="h-8 w-12 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="flex justify-center">
          <div className="h-10 w-28 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function PreferencesSkeleton() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-28 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="rounded-2xl border bg-card/60 p-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-56 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-6 w-11 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function DangerSkeleton() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
      </div>
      <div className="rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Configuración" subTitle="Gestiona tu cuenta y preferencias" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-16 pb-20 pt-6">
          <AccountSkeleton />
          <TimerSkeleton />
          <GoalSkeleton />
          <PreferencesSkeleton />
          <DangerSkeleton />
        </div>
      </div>
    </div>
  );
}
