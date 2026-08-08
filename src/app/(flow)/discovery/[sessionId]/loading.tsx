import { Skeleton } from "@/components/ui/skeleton";

export default function DiscoveryLoading() {
  return (
    <div className="ui-page ui-page-narrow flex flex-col gap-4">
      <Skeleton className="ml-auto h-4 w-16" />
      <Skeleton className="h-8 w-3/4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-20" />
      </div>
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
