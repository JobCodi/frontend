import { FlowShell } from "@/components/layout/flow-shell";

export default function FlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FlowShell>{children}</FlowShell>;
}
