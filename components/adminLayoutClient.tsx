"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import { signIn, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("credentials", { redirect: false });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
