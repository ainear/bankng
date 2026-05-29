import { NextResponse } from "next/server";
import { prisma } from "@bankng/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL ?? "NOT SET";
    const dbUrlMasked = dbUrl.replace(/:([^@]+)@/, ":***@").substring(0, 80);

    const count = await prisma.bank.count();

    return NextResponse.json({
      status: "ok",
      db: "connected",
      banks: count,
      dbUrl: dbUrlMasked,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const dbUrl = process.env.DATABASE_URL ?? "NOT SET";
    const dbUrlMasked = dbUrl.replace(/:([^@]+)@/, ":***@").substring(0, 80);
    return NextResponse.json(
      { status: "error", error: msg.substring(0, 300), dbUrl: dbUrlMasked },
      { status: 500 }
    );
  }
}
