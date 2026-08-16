import { Skeleton } from "@/components/ui/Skeleton";

export function SemanalSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/50 py-3 last:border-0">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <Skeleton className="mb-3 h-5 w-64" />
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-9 w-full" />
        ))}
      </div>
    </div>
  );
}
