import { Skeleton } from "@/components/ui/Skeleton";

export function ProgresoSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <Skeleton className="mb-3 h-5 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
