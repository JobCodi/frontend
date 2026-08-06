"use client";

import { usePathname } from "next/navigation";
import { StepProgress } from "./step-progress";

function stepForPathname(pathname: string): number {
  if (pathname.startsWith("/start")) return 1;
  if (pathname.includes("/criteria")) return 3;
  if (pathname.startsWith("/discovery")) return 2;
  if (pathname.startsWith("/feed")) return 4;
  return 1;
}

export function FlowShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentStep = stepForPathname(pathname ?? "/start");

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col bg-gradient-to-b from-gray-50/50 to-white">
      <StepProgress currentStep={currentStep} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
