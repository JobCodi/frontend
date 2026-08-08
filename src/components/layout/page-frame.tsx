import { cn } from "@/lib/utils/cn";

type PageFrameSize = "auth" | "narrow" | "standard" | "wide" | "full";

const sizeClass: Record<PageFrameSize, string> = {
  auth: "ui-page-auth",
  narrow: "ui-page-narrow",
  standard: "ui-page-standard",
  wide: "ui-page-wide",
  full: "ui-page-full",
};

interface PageFrameProps extends React.ComponentProps<"div"> {
  size?: PageFrameSize;
  as?: "div" | "main" | "section";
}

export function PageFrame({
  size = "standard",
  as: Component = "div",
  className,
  children,
  ...props
}: PageFrameProps) {
  return (
    <Component className={cn("ui-page", sizeClass[size], className)} {...props}>
      {children}
    </Component>
  );
}

export type { PageFrameSize };
