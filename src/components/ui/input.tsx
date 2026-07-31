import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.ComponentProps<"input">;

function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] px-3 text-[15px] text-[var(--text)] placeholder:text-[var(--text-subtle)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
