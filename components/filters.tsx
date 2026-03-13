"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FiltersProps {
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function ManageFilters({ activeFilter = "all", onFilterChange }: FiltersProps) {
  const handleFilterChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  return (
    <Tabs value={activeFilter} onValueChange={handleFilterChange}>
      <TabsList className="bg-card border border-border">
        <TabsTrigger value="all" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Todas</TabsTrigger>
        <TabsTrigger value="today" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Hoy</TabsTrigger>
        <TabsTrigger value="week" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Esta semana</TabsTrigger>
        <TabsTrigger value="overdue" className="data-[state=inactive]:text-muted-foreground cursor-pointer">Vencidas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
