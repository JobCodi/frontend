import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "세션 만료 | JobCodi",
};

export default function SessionExpiredPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <div aria-hidden="true" className="text-4xl">
        ⏱️
      </div>
      <h1 className="text-[22px] font-semibold leading-[30px] text-[var(--text)]">
        세션이 만료되었어요.
      </h1>
      <p className="text-[15px] leading-6 text-[var(--text-muted)]">
        대화 내용은 24시간 동안만 보관됩니다.
        <br />
        다시 시작하면 금방 끝나요.
      </p>
      <Button asChild size="lg">
        <Link href="/start">새로 시작하기</Link>
      </Button>
    </main>
  );
}
