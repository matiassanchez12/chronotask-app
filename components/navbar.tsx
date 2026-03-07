"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.[0].toUpperCase() || "?";

  return (
    <nav className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">Tododoro</span>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-9 w-9 rounded-full bg-muted hover:bg-muted/80 p-0 flex items-center justify-center"
          >
            <span className="text-sm font-medium">{userInitials}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
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
    </nav>
  );
}
