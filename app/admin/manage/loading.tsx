import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="flex flex-col gap-3 w-full h-full pt-4">
      <div className="flex gap-3 items-center">
        <Skeleton className="w-[200px] h-10" />
        <div className="flex border border-border rounded-md">
          <Skeleton className="h-10 w-16 rounded-l-md" />
          <Skeleton className="h-10 w-16 rounded-r-md" />
        </div>
      </div>

      <div className="flex gap-4 h-full w-full">
        <div className="w-64 shrink-0 border-r border-border/50 pr-4">
          <div className="sticky top-0 bg-background pb-2 mb-3 border-b border-border/30">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border bg-card/50"
              >
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex gap-2 h-full">
            {weekDays.map((day) => (
              <div
                key={day}
                className="flex-1 flex flex-col rounded-lg border p-2 min-w-[190px]"
              >
                <div className="text-xs font-medium text-center mb-2 pb-1 border-b border-border shrink-0">
                  <Skeleton className="h-4 w-12 mx-auto" />
                </div>
                <div className="px-2 mb-2">
                  <Skeleton className="h-1 w-full mb-1" />
                  <Skeleton className="h-2 w-20 mx-auto" />
                </div>
                <div className="flex-1 space-y-1 overflow-hidden">
                  {[...Array(2)].map((_, j) => (
                    <div
                      key={j}
                      className="p-2 rounded border bg-card/50"
                    >
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-2 w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
