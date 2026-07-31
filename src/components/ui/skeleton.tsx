import { cn } from "@/lib/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius)] bg-[var(--surface-soft)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
