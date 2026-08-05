"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
    <main className="mx-auto flex w-full max-w-md px-4 py-12 sm:py-20">
      <section className="w-full rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
        <p className="text-sm font-medium text-[var(--brand)]">JobCodi 관리자</p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text)]">관리자 로그인</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          수집 소스와 크롤링 사이트를 관리하려면 로그인해 주세요.
        </p>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
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
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]" htmlFor="admin-password">
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
            />
          </div>
          {errorMessage ? (
            <p aria-live="assertive" className="rounded-[var(--radius)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "로그인 중…" : "로그인"}
          </Button>
        </form>
      </section>
    </main>
  );
}

export { ADMIN_ACCESS_TOKEN_KEY };
