"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { 
  Calendar,
  Settings,
  X,
  Timer,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Hoy", href: "/admin", icon: Calendar },
  { name: "Gestionar", href: "/admin/manage", icon: ListTodo },
  { name: "En proceso", href: "/admin/in-progress", icon: Timer },
  { name: "Configuración", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={onClose}
      />
      
      <div className={cn(
        "fixed lg:relative z-50 lg:z-auto inset-y-0 left-0 w-60 h-screen bg-background border-r border-border flex flex-col shrink-0 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="ChonoTask"
                width={182}
                height={182}
                className="object-contain dark:invert dark:brightness-90"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === "/admin" && pathname === "/admin") ||
              (item.href === "/settings" && pathname === "/settings");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-500"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            v1.0.0
          </p>
        </div>
      </div>
    </>
  );
}
