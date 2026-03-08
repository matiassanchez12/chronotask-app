"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

export default function Header() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = format(now, "EEEE d 'de' MMMM yyyy", { locale: es });
  const capitalized = formatted.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bDe\b/g, "de");
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 sm:mb-10">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight">
          {capitalized}
        </h1>
        <span className="text-xs sm:text-sm text-muted-foreground block mt-2 sm:mt-0">
          {format(now, "h:mm a", { locale: es })}
        </span>
      </div>
    </div>
  );
}