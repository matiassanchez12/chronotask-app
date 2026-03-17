import { NextResponse } from "next/server";

export const runtime = "nodejs";

export default async function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
