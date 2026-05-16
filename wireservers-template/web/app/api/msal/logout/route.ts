import { NextResponse } from "next/server";
import { clearMsalCookies, getAuthority } from "@/lib/msalAuth";

export async function GET() {
  const postLogoutRedirectUri = process.env.AUTH_URL ?? "http://localhost:3002";
  const url = `${getAuthority()}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
  const response = NextResponse.redirect(url);
  clearMsalCookies(response);
  return response;
}

export async function POST() {
  return GET();
}
