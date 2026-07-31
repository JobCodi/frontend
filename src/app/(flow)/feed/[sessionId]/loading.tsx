import { FeedCardSkeleton } from "@/features/job-feed/components/job-list";

export default function FeedLoading() {
  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 px-4 py-8 md:grid-cols-2">
      <FeedCardSkeleton />
      <FeedCardSkeleton />
      <FeedCardSkeleton />
    </div>
  );
}
