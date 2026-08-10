import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/about", "/admin/login"];
const PROTECTED_PREFIXES = ["/start", "/discovery", "/feed", "/applications", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path is public
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }
  
  // Check if path needs protection
  const needsAuth = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!needsAuth) {
    return NextResponse.next();
  }
  
  // Check for auth cookie (SSR-friendly)
  const token = request.cookies.get("jobcodi_token")?.value;
  
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
