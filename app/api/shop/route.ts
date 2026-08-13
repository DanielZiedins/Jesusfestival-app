import { NextResponse } from "next/server";
import { getShopData } from "@/lib/shop-server";

export const revalidate = 900;

export async function GET() {
  const data = await getShopData();
  if (!data) {
    return NextResponse.json(
      { error: "The shop is temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=900, stale-while-revalidate=86400",
    },
  });
}
