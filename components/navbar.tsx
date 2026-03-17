"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, Settings, Menu } from "lucide-react";
import Image from "next/image";
import TipsModal from "@/components/tipsModal";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

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
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <TipsModal />
        <Button
                variant="ghost"
                className="justify-start gap-2 transition-all duration-200"
                onClick={toggleTheme}
              >
                <span className="transition-transform duration-200 rotate-0 hover:rotate-45">
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </span>
        </Button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 p-0 flex items-center justify-center relative overflow-hidden"
              aria-label="Menú de usuario"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session?.user?.name || "Usuario"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-sm font-medium">{userInitials}</span>
              )}
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
