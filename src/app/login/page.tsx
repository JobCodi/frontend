"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { useAuth } from "@/lib/auth/context";
import { safeAuthRedirect } from "@/lib/auth/redirect";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      router.push(safeAuthRedirect(redirect));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "로그인에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      footer={
        <>
          계속 진행하면 <Link href="/about" className="underline hover:text-[var(--text-muted)]">이용약관</Link>에 동의하는 것으로 간주됩니다.
        </>
      }
    >
      <section className="ui-card-elevated overflow-hidden p-[var(--card-space-lg)] sm:p-8">
        <header className="mb-7">
          <p className="ui-eyebrow">Welcome back</p>
          <h1 className="ui-page-title mt-2">돌아오신 걸 환영해요</h1>
          <p className="ui-body mt-2">AI가 맞춤 공고를 찾아드립니다.</p>
        </header>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block" htmlFor="email">
            <span className="ui-card-title mb-2 block">이메일</span>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]" />
          </label>
          <label className="block" htmlFor="password">
            <span className="ui-card-title mb-2 block">비밀번호</span>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="••••••••" className="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--text)] shadow-sm outline-none transition focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand-soft)]" />
          </label>
          {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
          <button type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[var(--brand)] to-[#7c3aed] text-sm font-semibold text-white shadow-lg shadow-[rgba(84,69,244,0.25)] transition hover:brightness-105 disabled:opacity-60">
            {loading ? "로그인 중…" : "로그인"}
          </button>
        </form>
        <p className="ui-body mt-6 text-center">아직 계정이 없으신가요? <Link href="/signup" className="font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)]">회원가입</Link></p>
      </section>
    </AuthShell>
  );
}
