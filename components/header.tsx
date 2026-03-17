import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  subTitle?: string;
}

export default function Header({ title, subTitle }: HeaderProps) {
  return (
   <div className="flex items-center justify-between">
          <div>
            <Link
              href="/admin" 
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-1">{subTitle}</p>
          </div>
        </div>
  );
}
