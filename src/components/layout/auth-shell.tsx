import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { PageFrame } from "./page-frame";

interface AuthShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ children, footer }: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="app-grid absolute inset-0 opacity-35" />
        <div className="absolute left-1/2 top-0 h-[34rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--brand-glow),transparent_68%)] blur-3xl" />
      </div>
      <PageFrame size="auth" className="relative z-10">
        <div className="mb-7 text-center">
          <Link href="/" className="inline-flex rounded-lg transition-opacity hover:opacity-80">
            <Image
              src="/brand/01_primary_horizontal_logo.png"
              alt="JobCodi"
              width={126}
              height={32}
              priority
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>
        {children}
        {footer ? <div className="ui-meta mt-6 text-center">{footer}</div> : null}
      </PageFrame>
    </main>
  );
}
