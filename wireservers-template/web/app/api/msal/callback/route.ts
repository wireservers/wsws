import { NextRequest, NextResponse } from "next/server";
import { clearLoginTempCookies, createSessionFromCode, readLoginCookies, writeMsalSession } from "@/lib/msalAuth";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const returnedState = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const errorDescription = req.nextUrl.searchParams.get("error_description");

  if (error) return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(errorDescription ?? error)}`, req.url));
  if (!code || !returnedState) return NextResponse.redirect(new URL("/?error=missing_code", req.url));

  const { state, verifier } = await readLoginCookies();
  if (!state || !verifier || state !== returnedState) return NextResponse.redirect(new URL("/?error=invalid_state", req.url));

  try {
    const { session, callbackUrl } = await createSessionFromCode(code, state, verifier);
    const response = NextResponse.redirect(new URL(callbackUrl, req.url));
    await writeMsalSession(response, session);
    clearLoginTempCookies(response);
    return response;
  } catch (authError) {
    console.error("MSAL callback failed", authError);
    return NextResponse.redirect(new URL("/?error=callback_failed", req.url));
  }
}
