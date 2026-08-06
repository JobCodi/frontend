import { QueryProvider } from "@/components/providers/query-provider";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen flex-col">
        <MarketingHeader />
        <div className="flex-1">{children}</div>
        <MarketingFooter />
      </div>
    </QueryProvider>
  );
}
