"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Moon, Sun, Bell } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const notificationCount = 3;

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() || "?";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-2">
        <Image 
          src="/logo.svg" 
          alt="Tododoro" 
          width={68} 
          height={68}
          className={`object-contain ${theme === "dark" ? "invert brightness-90" : ""}`}
        />
        <span className="font-semibold text-lg">Tododoro</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 p-0 flex items-center justify-center relative"
              aria-label="Menú de usuario"
            >
              <span className="text-sm font-medium">{userInitials}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{session?.user?.name || "Usuario"}</span>
                  <span className="text-xs text-muted-foreground">{session?.user?.email}</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-2 transition-all duration-200"
                onClick={toggleTheme}
                aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                <span className="transition-transform duration-200 rotate-0 hover:rotate-180">
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </span>
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
