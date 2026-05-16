import { NextResponse } from "next/server";
import { readMsalSession } from "@/lib/msalAuth";

export async function GET() {
  const session = await readMsalSession();
  return NextResponse.json({
    authenticated: Boolean(session),
    user: session?.account ?? null,
    expiresOn: session?.expiresOn ?? null,
  });
}
