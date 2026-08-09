import { Clock3, Sparkles, Trash2 } from "lucide-react";
import type { DailyFeedSummary } from "@/lib/schemas/daily-feed-summary";

export function DailyFeedSummaryCard({ summary }: { summary: DailyFeedSummary }) {
  return (
    <section aria-label="오늘의 공고 변화" className="rounded-2xl border border-[var(--brand)]/15 bg-gradient-to-r from-[var(--brand-soft)]/60 via-white to-[#f3e8ff]/35 p-4">
      <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand)] text-white"><Sparkles className="h-4 w-4" /></span><div><h2 className="text-sm font-semibold text-[var(--text)]">오늘의 변화</h2><p className="text-xs text-[var(--text-muted)]">매일 갱신된 맞춤 공고 결과예요</p></div></div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="신규" value={summary.newCount} tone="brand" icon={<Sparkles className="h-3.5 w-3.5" />} />
        <Metric label="마감 임박" value={summary.closingSoonCount} tone="danger" icon={<Clock3 className="h-3.5 w-3.5" />} />
        <Metric label="사라짐" value={summary.removedCount} tone="muted" icon={<Trash2 className="h-3.5 w-3.5" />} />
      </div>
    </section>
  );
}

function Metric({ label, value, tone, icon }: { label: string; value: number; tone: "brand" | "danger" | "muted"; icon: React.ReactNode }) {
  const colors = tone === "danger" ? "text-red-600" : tone === "brand" ? "text-[var(--brand)]" : "text-[var(--text-muted)]";
  return <div className="rounded-xl border border-white/80 bg-white/85 p-3"><div className={`flex items-center gap-1 text-xs font-medium ${colors}`}>{icon}{label}</div><p className="mt-1 text-xl font-bold text-[var(--text)]">{value}</p></div>;
}
