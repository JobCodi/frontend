import { QueryProvider } from "@/components/providers/query-provider";
import { AppHeader } from "@/components/layout/app-header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <div className="flex-1">{children}</div>
      </div>
    </QueryProvider>
  );
}
