import { Skeleton } from "@/components/ui/Skeleton";

export function HoySkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-16" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-48" />
              <div className="flex gap-1">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-14" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-14" />
                <Skeleton className="h-14" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
