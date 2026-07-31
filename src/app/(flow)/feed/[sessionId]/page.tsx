import { Suspense } from "react";
import { FeedScreen } from "@/features/job-feed";
import { FeedCardSkeleton } from "@/features/job-feed/components/job-list";

export const metadata = {
  title: "공고 피드 | JobCodi",
};

interface FeedPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function FeedPage({ params }: FeedPageProps) {
  const { sessionId } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-3 px-4 py-8 md:grid-cols-2">
          <FeedCardSkeleton />
          <FeedCardSkeleton />
        </div>
      }
    >
      <FeedScreen sessionId={sessionId} />
    </Suspense>
  );
}
