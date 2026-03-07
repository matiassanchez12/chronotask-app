"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("filter") || "today";

  return (
    <Tabs
      value={active}
      onValueChange={(value) => router.push(`/admin?filter=${value}`)}
      className="mb-6"
    >
      <TabsList className="bg-card border border-border">
        <TabsTrigger value="today" className="data-[state=inactive]:text-foreground cursor-pointer">Hoy</TabsTrigger>
        <TabsTrigger value="tomorrow" className="data-[state=inactive]:text-foreground cursor-pointer">Mañana</TabsTrigger>
        <TabsTrigger value="week" className="data-[state=inactive]:text-foreground cursor-pointer">Semana</TabsTrigger>
        <TabsTrigger value="month" className="data-[state=inactive]:text-foreground cursor-pointer">Mes</TabsTrigger>
        <TabsTrigger value="all" className="data-[state=inactive]:text-foreground cursor-pointer">Todas</TabsTrigger>
        
      </TabsList>
    </Tabs>
  );
}