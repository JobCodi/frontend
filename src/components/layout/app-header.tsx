import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth/context";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Image
            src="/brand/01_primary_horizontal_logo.png"
            alt="JobCodi"
            width={112}
            height={28}
            priority
            style={{ height: 24, width: "auto" }}
          />
        </Link>
        <div className="flex items-center gap-4">
          <nav aria-label="주요 메뉴" className="text-sm">
            <Link
              href="/about"
              className="text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-3 py-1.5"
            >
              소개
            </Link>
          </nav>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button
                onClick={logout}
                size="sm"
                variant="secondary"
                className="gap-1.5 rounded-lg"
              >
                <LogOut className="h-3.5 w-3.5" />
                로그아웃
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
