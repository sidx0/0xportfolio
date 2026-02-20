import { NextRequest, NextResponse } from "next/server";
import { saveSnapshot, getSnapshots } from "@/lib/snapshots";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const days = parseInt(searchParams.get("days") ?? "30", 10);

  if (!address) {
    return NextResponse.json(
      { error: "Missing required parameter: address" },
      { status: 400 }
    );
  }

  try {
    const snapshots = await getSnapshots(address.toLowerCase(), days);
    return NextResponse.json({ snapshots });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/snapshot GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { address?: string };
    const address = body.address;

    if (!address) {
      return NextResponse.json(
        { error: "Missing required field: address" },
        { status: 400 }
      );
    }

    await saveSnapshot(address.toLowerCase());
    return NextResponse.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/snapshot POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
