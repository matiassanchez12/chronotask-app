import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export default async function middleware(req: any) {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const isAdminPage = pathname.startsWith("/admin");
  const isRootPage = pathname === "/";

  if (isAdminPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
