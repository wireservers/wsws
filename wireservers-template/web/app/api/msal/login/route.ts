import { NextRequest, NextResponse } from "next/server";
import { buildLoginUrl, writeLoginCookies } from "@/lib/msalAuth";

export async function GET(req: NextRequest) {
  const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") ?? "/dashboard";
  const { url, state, verifier } = await buildLoginUrl(callbackUrl);
  const response = NextResponse.redirect(url);
  writeLoginCookies(response, state, verifier);
  return response;
}
