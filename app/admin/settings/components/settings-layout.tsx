import Header from "@/components/header";

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <Header title="Configuración" subTitle="Gestiona tu cuenta y preferencias" />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-16 pb-20 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
