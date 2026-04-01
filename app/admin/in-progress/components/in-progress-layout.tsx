import Header from "@/components/header";

export function InProgressLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 h-full">
      <Header title="En Progreso" subTitle="Gestiona tus sesiones de trabajo" />
      {children}
    </div>
  );
}
