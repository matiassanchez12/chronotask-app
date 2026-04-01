"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { DateRangePicker, type DateRange } from "@/components/date-range-picker";
import { List, LayoutGrid } from "lucide-react";

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ManageFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "columns";
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const initialDateRange = useMemo(() => {
    if (!fromParam || !toParam) return undefined;
    const from = new Date(fromParam);
    const to = new Date(toParam);
    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
      return { from, to };
    }
    return undefined;
  }, [fromParam, toParam]);

  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);

  const buildUrl = useCallback(
    (params: Record<string, string | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });
      return `/admin/manage?${current.toString()}`;
    },
    [searchParams]
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      router.push(
        buildUrl({
          filter: "range",
          from: formatDate(range.from),
          to: formatDate(range.to),
        })
      );
    }
  };

  const handleViewChange = (view: string) => {
    router.push(buildUrl({ view }));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex w-full justify-between gap-2">
          <div className="w-[180px] sm:w-[200px]">
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateRangeChange}
              placeholder="Seleccionar fechas"
            />
          </div>

          <div className="flex border border-border rounded-md shrink-0">
            <Button
              variant={currentView === "columns" ? "default" : "ghost"}
              size="default"
              className="rounded-r-none px-2 sm:px-3"
              onClick={() => handleViewChange("columns")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Columnas</span>
            </Button>
            <Button
              variant={currentView === "list" ? "default" : "ghost"}
              size="default"
              className="rounded-l-none px-2 sm:px-3"
              onClick={() => handleViewChange("list")}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Lista</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
