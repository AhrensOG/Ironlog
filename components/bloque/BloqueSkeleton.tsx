import { Skeleton } from "@/components/ui/Skeleton";

export function BloqueSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-16 min-w-14" />
        ))}
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="rounded-2xl border border-border bg-card p-4">
        <Skeleton className="mb-3 h-5 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
