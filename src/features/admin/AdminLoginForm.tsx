"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/features/admin/admin-api";
import { ApiError } from "@/lib/api/client";

const ADMIN_ACCESS_TOKEN_KEY = "jobcodi.admin.access-token";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_ACCESS_TOKEN_KEY) !== null) {
      router.replace("/admin");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const session = await loginAdmin(email.trim(), password);
      sessionStorage.setItem(ADMIN_ACCESS_TOKEN_KEY, session.accessToken);
      router.replace("/admin");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError && error.status === 401
          ? "이메일 또는 비밀번호를 확인해 주세요."
          : "로그인하지 못했어요. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="app-grid absolute inset-0 opacity-40" />
        <div className="absolute left-1/2 top-16 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(84,69,244,0.14),transparent_70%)] blur-2xl" />
      </div>

      <section className="relative w-full overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[var(--shadow-elevated)]">
        <div className="border-b border-[var(--line)] bg-gradient-to-br from-white via-[var(--brand-soft)]/40 to-[#f3e8ff]/40 px-6 py-7 sm:px-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]">
            <Shield className="h-5 w-5" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
            JobCodi Admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
            관리자 로그인
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            수집 소스와 크롤링 사이트를 관리하려면 로그인해 주세요.
          </p>
        </div>

        <form className="space-y-5 px-6 py-7 sm:px-8" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor="admin-email">
              이메일
            </label>
            <Input
              autoComplete="email"
              disabled={isSubmitting}
              id="admin-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
              className="h-11 rounded-xl"
            />
          </div>
          <div>
            <label
              className="mb-2 block text-sm font-medium text-[var(--text)]"
              htmlFor="admin-password"
            >
              비밀번호
            </label>
            <Input
              autoComplete="current-password"
              disabled={isSubmitting}
              id="admin-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
              className="h-11 rounded-xl"
            />
          </div>
          {errorMessage ? (
            <p
              aria-live="assertive"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}
          <Button
            className="w-full rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#7c3aed] text-white shadow-lg shadow-[rgba(84,69,244,0.25)]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export { ADMIN_ACCESS_TOKEN_KEY };
