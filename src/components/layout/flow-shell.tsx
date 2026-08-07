"use client";

import { usePathname } from "next/navigation";
import { AppHeader } from "./app-header";
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
    <div className="relative flex min-h-screen flex-col bg-[var(--bg)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="app-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-0 h-[480px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(84,69,244,0.16),transparent_68%)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[520px] translate-x-1/5 translate-y-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-24 left-0 h-[240px] w-[320px] -translate-x-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_70%)] blur-2xl" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader />
        <StepProgress currentStep={currentStep} />
        <main className="flex-1 pb-10">{children}</main>
      </div>
    </div>
  );
}
