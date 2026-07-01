import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin") {
    return Response.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname === "/admin/login") {
    return Response.redirect(new URL("/auth", request.url));
  }

  return undefined;
}

export const config = {
  matcher: ["/admin/:path*"],
};
