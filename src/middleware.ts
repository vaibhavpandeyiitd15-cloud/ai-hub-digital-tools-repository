import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/auth/constants";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const isAdminArea = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const hasSession = Boolean(request.cookies.get(ADMIN_COOKIE)?.value);

  if (isAdminArea) {
    if (isLoginPage && hasSession) {
      return NextResponse.redirect(new URL("/admin/tools", request.url));
    }
    if (!isLoginPage && !hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
