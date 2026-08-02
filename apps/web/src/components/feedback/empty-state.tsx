import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center">
      {icon ? (
        <div aria-hidden="true" className="text-3xl">
          {icon}
        </div>
      ) : null}
      <p className="text-[15px] font-medium text-[var(--text)]">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
