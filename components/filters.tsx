"use client";

import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

interface FiltersProps {
  basePath?: string;
}

export default function ManageFilters({ basePath = "/admin/manage" }: FiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("filter") || "all";

  const handleFilterChange = (value: string) => {
    router.push(`${basePath}?filter=${value}`);
  };

  return (
    <Tabs value={active} onValueChange={handleFilterChange}>
      <TabsList className="bg-card border border-border">
        <TabsTrigger value="all" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Todas</TabsTrigger>
        <TabsTrigger value="today" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Hoy</TabsTrigger>
        <TabsTrigger value="week" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Esta semana</TabsTrigger>
        <TabsTrigger value="overdue" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Vencidas</TabsTrigger>
      </TabsList>
      <TabsContent value="all" />
      <TabsContent value="today" />
      <TabsContent value="week" />
      <TabsContent value="overdue" />
    </Tabs>
  );
}
