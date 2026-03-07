import AddTaskModal from "@/components/addTaskModal";
import Navbar from "@/components/navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <AddTaskModal />
      {children}
    </>
  );
}
