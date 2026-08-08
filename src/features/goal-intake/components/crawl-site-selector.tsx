"use client";

import { Check } from "lucide-react";
import { PREBUILT_CRAWL_SITES } from "@/lib/fixtures/crawl-sites";
import { cn } from "@/lib/utils/cn";

interface CrawlSiteSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function CrawlSiteSelector({ selectedIds, onChange, disabled = false }: CrawlSiteSelectorProps) {
  function toggleSite(siteId: string) {
    const next = selectedIds.includes(siteId)
      ? selectedIds.filter((id) => id !== siteId)
      : [...selectedIds, siteId];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[var(--text)]">수집 사이트 선택</label>
        <span className="text-xs text-[var(--text-muted)]">{selectedIds.length}개 선택됨</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {PREBUILT_CRAWL_SITES.map((site) => {
          const selected = selectedIds.includes(site.id);
          return (
            <button
              key={site.id}
              type="button"
              disabled={disabled}
              onClick={() => toggleSite(site.id)}
              className={cn(
                "relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                "hover:shadow-md hover:scale-[1.01]",
                "disabled:cursor-not-allowed disabled:opacity-50",
                selected
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] ring-2 ring-[var(--brand)]/20"
                  : "border-[var(--line)] bg-[var(--surface)] hover:border-[var(--brand)]/30",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                  selected ? "border-[var(--brand)] bg-[var(--brand)]" : "border-[var(--line-strong)]",
                )}
              >
                {selected && <Check className="h-3 w-3 text-white" />}
              </div>
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-[var(--text)]">{site.displayName}</div>
                <div className="text-xs text-[var(--text-muted)]">{site.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      {selectedIds.length === 0 && (
        <p className="text-xs text-[var(--text-muted)]">
          하나 이상의 수집 사이트를 선택해주세요.
        </p>
      )}
    </div>
  );
}
