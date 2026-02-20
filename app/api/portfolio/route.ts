import { NextRequest, NextResponse } from "next/server";
import { fetchPortfolio } from "@/lib/portfolio";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Missing required parameter: address" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.upsert({
      where: { walletAddress: address.toLowerCase() },
      update: {},
      create: { walletAddress: address.toLowerCase() },
    });

    const portfolio = await fetchPortfolio(address);
    return NextResponse.json(portfolio);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/portfolio]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
