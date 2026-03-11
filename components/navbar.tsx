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
  const [userImage, setUserImage] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    async function fetchUserImage() {
      try {
        const res = await fetch("/api/user/image");
        if (res.ok) {
          const data = await res.json();
          setUserImage(data.image);
        }
      } catch (e) {
        console.error("Failed to fetch user image:", e);
      }
    }
    if (session?.user) {
      fetchUserImage();
    }
  }, [session]);

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
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 p-0 flex items-center justify-center relative overflow-hidden"
              aria-label="Menú de usuario"
            >
              {userImage ? (
                <Image
                  src={userImage}
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
