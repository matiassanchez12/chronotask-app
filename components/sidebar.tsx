"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar,
  Settings,
  X,
  Timer,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./logo";

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
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm",
          isOpen ? "block" : "hidden"
        )}
        onClick={onClose}
      />
      
      <aside className={cn(
        "fixed lg:relative z-50 lg:z-auto inset-y-0 left-0 w-64 h-screen bg-background/80 backdrop-blur-xl border-r border-border/50 flex flex-col shrink-0 transition-all duration-300 ease-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <Link href='/admin' className="flex items-center gap-2.5 group">
              <div className="relative flex gap-2 items-center">
                <Logo />
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8 hover:bg-border/50"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href === "/admin" && pathname === "/admin");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "text-foreground bg-gradient-to-r from-foreground/5 to-transparent"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-foreground rounded-r-full" />
                  )}
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground group-hover:scale-110"
                  )} />
                  <span className="relative">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-foreground/5 via-foreground/5 to-transparent border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
