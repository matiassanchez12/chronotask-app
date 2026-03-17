"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ManageFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  return (
     <Tabs value={currentFilter} onValueChange={(v) => router.push(`/admin/manage?filter=${v}`)}>
      <TabsList className="bg-card border border-border">
        <TabsTrigger value="all" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Todas</TabsTrigger>
        <TabsTrigger value="today" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Hoy</TabsTrigger>
        <TabsTrigger value="week" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Esta semana</TabsTrigger>
        <TabsTrigger value="overdue" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Vencidas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
