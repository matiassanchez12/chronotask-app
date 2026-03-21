import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar () {
  return <nav className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Iniciar sesión</Button>
            </Link>
            <Link href="/admin">
              <Button>Ir al panel</Button>
            </Link>
          </div>
        </div>
      </nav>;
};