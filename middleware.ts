import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export default async function middleware(req: any) {
  // const session = await getServerSession();
  // const isLoggedIn = !!session;
  // const { pathname } = req.nextUrl;

  // const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  // const isAdminPage = pathname.startsWith("/admin");

  // if (isAdminPage && !isLoggedIn) {
  //   return NextResponse.redirect(new URL("/sign-in", req.url));
  // }

  // if (isAuthPage && isLoggedIn) {
  //   return NextResponse.redirect(new URL("/admin", req.url));
  // }

  // if (pathname === "/" && isLoggedIn) {
  //   return NextResponse.redirect(new URL("/admin", req.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
