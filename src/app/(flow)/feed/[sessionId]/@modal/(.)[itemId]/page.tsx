import { JobDetailModal } from "@/features/job-feed";

interface InterceptedJobModalPageProps {
  params: Promise<{ sessionId: string; itemId: string }>;
}

export default async function InterceptedJobModalPage({ params }: InterceptedJobModalPageProps) {
  const { sessionId, itemId } = await params;
  return <JobDetailModal sessionId={sessionId} itemId={itemId} />;
}
