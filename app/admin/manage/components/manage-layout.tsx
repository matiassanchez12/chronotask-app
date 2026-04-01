import AddTaskModal from "@/components/modals/add-task-modal";
import Header from "@/components/header";

interface ManageLayoutProps {
  children: React.ReactNode;
}

export function ManageLayout({ children }: ManageLayoutProps) {
  return (
    <>
      <AddTaskModal />
      <div className="flex flex-col w-full h-full">
        <Header title="Gestionar" subTitle="Edita o elimina tareas" />
        <div className="flex-1 mb-12 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
}
