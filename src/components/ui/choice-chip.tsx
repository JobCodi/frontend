import * as React from "react";
import { Check } from "lucide-react";
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
  children,
  ...props
}: ChoiceChipProps) {
  return (
    <button
      type={type}
      role={role}
      aria-checked={selected}
      data-state={selected ? "checked" : "unchecked"}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--brand)] disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-transparent bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-md shadow-[rgba(84,69,244,0.25)]"
          : "border-[var(--line)] bg-white text-[var(--text)] shadow-sm hover:border-[var(--brand)]/40 hover:bg-[var(--brand-soft)]/60 hover:text-[var(--brand-strong)]",
        className,
      )}
      {...props}
    >
      {selected ? <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} aria-hidden="true" /> : null}
      {children}
    </button>
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
