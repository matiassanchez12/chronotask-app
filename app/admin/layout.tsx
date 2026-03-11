import AdminLayoutClient from "@/components/adminLayoutClient";
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
    <div style={{ fontSize: `${fontSize}px` }}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </div>
  );
}
