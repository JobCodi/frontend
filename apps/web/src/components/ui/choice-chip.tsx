import * as React from "react";
import { cn } from "@/lib/utils/cn";

/**
 * A selectable option rendered as a real <button> with role="radio" or
 * role="checkbox" — never a styled <div onClick>. See product.md §7 /
 * design-system.md §7.
 */
export interface ChoiceChipProps extends Omit<React.ComponentProps<"button">, "role"> {
  selected?: boolean;
  role?: "radio" | "checkbox";
}

function ChoiceChip({
  selected = false,
  role = "checkbox",
  className,
  type = "button",
  ...props
}: ChoiceChipProps) {
  return (
    <button
      type={type}
      role={role}
      aria-checked={selected}
      data-state={selected ? "checked" : "unchecked"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--brand)] disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
          : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]",
        className,
      )}
      {...props}
    />
  );
}

interface ChipGroupProps extends React.ComponentProps<"div"> {
  label: string;
  multiple?: boolean;
}

/** Wraps a set of ChoiceChips with the right group role + accessible label. */
function ChipGroup({ label, multiple = true, className, children, ...props }: ChipGroupProps) {
  return (
    <div
      role={multiple ? "group" : "radiogroup"}
      aria-label={label}
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { ChoiceChip, ChipGroup };
