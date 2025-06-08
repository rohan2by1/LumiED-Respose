//middleware.js
// middleware.js
import { NextResponse } from "next/server";
import { verifySession } from "./app/_lib/session";

const ADMIN_ROUTES = ["/admin"];
const PROTECTED_ROUTES = ["/profile"];
const PUBLIC_AUTH_ROUTES = ["/auth", "/auth/forgot-password"];
const LOGOUT_ROUTE = "/auth/logout";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = await verifySession();

  // 🔒 If user is logged out but trying to access logout → redirect to home
  if (pathname === LOGOUT_ROUTE && !session?.isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔐 If user is logged in and accessing auth or forgot-password → redirect to home
  if (session?.isAuth && PUBLIC_AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 👮 Admin Routes
  const isAdminPath = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  if (isAdminPath) {
    if (!session?.isAuth || session.role !== "admin") {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // 👤 Protected User Routes
  const isProtectedPath = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtectedPath) {
    if (!session?.isAuth) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path",
    "/profile",
  ],
};
