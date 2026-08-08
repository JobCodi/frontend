import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="ui-eyebrow">{eyebrow}</p> : null}
        <h1 className={cn("ui-page-title", eyebrow && "mt-2")}>{title}</h1>
        {description ? <div className="ui-body mt-2 max-w-2xl">{description}</div> : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
