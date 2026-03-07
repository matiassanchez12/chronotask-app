import AddTaskModal from "@/components/addTaskModal";
import Navbar from "@/components/navbar";
import { getUserSettings } from "@/app/actions/settings";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getUserSettings();
  const fontSize = settings?.fontSize || 16;

  return (
    <>
      <Navbar />
      <AddTaskModal />
      <main style={{ "--font-size": `${fontSize}px` } as React.CSSProperties} className="[font-size:var(--font-size)]">
        {children}
      </main>
    </>
  );
}
