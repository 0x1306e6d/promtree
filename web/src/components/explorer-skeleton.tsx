import { Skeleton } from "@/components/ui/skeleton";

export default function ExplorerSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <div className="flex items-center rounded-lg border bg-muted/50 px-4 py-2.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="ml-auto h-4 w-16" />
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border p-4">
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-10 rounded-md" />
        </div>
      ))}
    </div>
  );
}
