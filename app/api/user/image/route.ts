import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ image: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    return NextResponse.json({ image: user?.image || null });
  } catch (e) {
    console.error("GET /api/user/image:", e);
    return NextResponse.json({ image: null }, { status: 500 });
  }
}
