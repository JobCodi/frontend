import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--line)] bg-white px-8 py-14 text-center shadow-[var(--shadow-card)]">
      {icon ? (
        <div
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-soft)] to-[#f3e8ff] text-2xl text-[var(--brand)] shadow-inner"
        >
          {icon}
        </div>
      ) : null}
      <div className="space-y-2">
        <p className="text-lg font-semibold text-[var(--text)]">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm leading-6 text-[var(--text-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
