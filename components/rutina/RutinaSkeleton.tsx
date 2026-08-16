import { Skeleton } from "@/components/ui/Skeleton";

export function RutinaSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-32" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-16" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex-1">
              <Skeleton className="h-5 w-52" />
              <Skeleton className="mt-2 h-4 w-72" />
            </div>
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-9" />
          </div>
        ))}
      </div>
    </div>
  );
}
