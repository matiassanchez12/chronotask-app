"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

interface ManageFiltersProps {
  basePath?: string;
}

export default function ManageFilters({ basePath = "/admin/manage" }: ManageFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();
  const active = params.get("filter") || "all";

  const handleFilterChange = (value: string) => {
    router.push(`${basePath}?filter=${value}`);
  };

  return (
    <Tabs value={active} onValueChange={handleFilterChange} className="mb-6">
      <TabsList className="bg-card border border-border">
        <TabsTrigger value="all" className="data-[state=inactive]:text-foreground cursor-pointer">Todas</TabsTrigger>
        <TabsTrigger value="today" className="data-[state=inactive]:text-foreground cursor-pointer">Hoy</TabsTrigger>
        <TabsTrigger value="week" className="data-[state=inactive]:text-foreground cursor-pointer">Esta semana</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
