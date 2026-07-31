import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5",
  {
    variants: {
      variant: {
        neutral: "bg-[var(--surface-soft)] text-[var(--text-muted)]",
        brand: "bg-[var(--brand-soft)] text-[var(--brand-strong)]",
        match: "bg-[var(--match-soft)] text-[var(--match)]",
        caution: "bg-[var(--caution-soft)] text-[var(--caution)]",
        gap: "bg-[var(--gap-soft)] text-[var(--gap)]",
        danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
