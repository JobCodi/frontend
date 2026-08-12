import { DiscoveryPageClient } from "@/features/discovery/components/discovery-page-client";

export const metadata = {
  title: "AI 대화 | JobCodi",
};

interface DiscoveryPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function DiscoveryPage({ params }: DiscoveryPageProps) {
  const { sessionId } = await params;
  return <DiscoveryPageClient sessionId={sessionId} />;
}
