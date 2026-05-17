import crypto from "node:crypto";
import {
  ConfidentialClientApplication,
  CryptoProvider,
  type AccountInfo,
  type AuthorizationUrlRequest,
  type Configuration,
  type SilentFlowRequest,
} from "@azure/msal-node";
import { cookies } from "next/headers";

const sessionCookie = "wireserverstemplate.msal";
const stateCookie = "wireserverstemplate.msal.state";
const verifierCookie = "wireserverstemplate.msal.verifier";
const cookieMaxAge = 60 * 60 * 8;

export type MsalSession = {
  accessToken: string;
  expiresOn: number;
  accountHomeId: string;
  account: {
    name?: string;
    username?: string;
    localAccountId?: string;
  };
  tokenCache: string;
};

type StatePayload = {
  callbackUrl: string;
  nonce: string;
};

export function getAuthority() {
  const issuer = process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER?.replace(/\/$/, "");
  if (!issuer) throw new Error("AUTH_MICROSOFT_ENTRA_ID_ISSUER is required");
  return issuer.endsWith("/v2.0") ? issuer.slice(0, -"/v2.0".length) : issuer;
}

export function getRedirectUri() {
  const base = process.env.AUTH_URL ?? "http://localhost:3002";
  return `${base.replace(/\/$/, "")}/api/msal/callback`;
}

export function getScopes() {
  const apiScope = process.env.NEXT_PUBLIC_API_SCOPE;
  if (!apiScope) throw new Error("NEXT_PUBLIC_API_SCOPE is required");
  return ["openid", "profile", "email", "offline_access", apiScope];
}

export function createMsalClient(cache?: string) {
  const clientSecret = process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET;
  if (!clientSecret) throw new Error("AUTH_MICROSOFT_ENTRA_ID_SECRET is required for MSAL confidential-client auth.");

  const config: Configuration = {
    auth: {
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID ?? "",
      authority: getAuthority(),
      clientSecret,
    },
    system: {
      loggerOptions: {
        piiLoggingEnabled: false,
      },
    },
  };
  const client = new ConfidentialClientApplication(config);
  if (cache) client.getTokenCache().deserialize(cache);
  return client;
}

export async function buildLoginUrl(callbackUrl: string) {
  const msal = createMsalClient();
  const cryptoProvider = new CryptoProvider();
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
  const state = await seal<StatePayload>({
    callbackUrl: normalizeCallbackUrl(callbackUrl),
    nonce: crypto.randomBytes(16).toString("base64url"),
  });

  const request: AuthorizationUrlRequest = {
    scopes: getScopes(),
    redirectUri: getRedirectUri(),
    responseMode: "query",
    codeChallenge: challenge,
    codeChallengeMethod: "S256",
    state,
  };

  return { url: await msal.getAuthCodeUrl(request), state, verifier };
}

export async function createSessionFromCode(code: string, state: string, verifier: string) {
  const statePayload = await unseal<StatePayload>(state);
  if (!statePayload) throw new Error("Invalid MSAL state.");

  const msal = createMsalClient();
  const result = await msal.acquireTokenByCode({
    code,
    scopes: getScopes(),
    redirectUri: getRedirectUri(),
    codeVerifier: verifier,
  });

  if (!result?.accessToken || !result.account) throw new Error("MSAL did not return an API access token.");

  const session: MsalSession = {
    accessToken: result.accessToken,
    expiresOn: result.expiresOn?.getTime() ?? Date.now() + 3600_000,
    accountHomeId: result.account.homeAccountId,
    account: serializeAccount(result.account),
    tokenCache: msal.getTokenCache().serialize(),
  };

  return { session, callbackUrl: statePayload.callbackUrl };
}

export async function readMsalSession() {
  const jar = await cookies();
  const sealed = jar.get(sessionCookie)?.value;
  return sealed ? unseal<MsalSession>(sealed) : null;
}

export async function getMsalAccessToken() {
  const session = await readMsalSession();
  if (!session) return null;
  if (Date.now() < session.expiresOn - 60_000) return session.accessToken;

  const msal = createMsalClient(session.tokenCache);
  const account = await msal.getTokenCache().getAccountByHomeId(session.accountHomeId);
  if (!account) return session.accessToken;

  const request: SilentFlowRequest = {
    account,
    scopes: [process.env.NEXT_PUBLIC_API_SCOPE ?? ""],
  };
  const result = await msal.acquireTokenSilent(request);
  return result?.accessToken ?? session.accessToken;
}

export async function writeMsalSession(response: Response, session: MsalSession) {
  const value = await seal(session);
  response.headers.append("Set-Cookie", serializeCookie(sessionCookie, value, cookieMaxAge));
}

export function clearMsalCookies(response: Response) {
  response.headers.append("Set-Cookie", serializeCookie(sessionCookie, "", 0));
  response.headers.append("Set-Cookie", serializeCookie(stateCookie, "", 0));
  response.headers.append("Set-Cookie", serializeCookie(verifierCookie, "", 0));
}

export function clearLoginTempCookies(response: Response) {
  response.headers.append("Set-Cookie", serializeCookie(stateCookie, "", 0));
  response.headers.append("Set-Cookie", serializeCookie(verifierCookie, "", 0));
}

export function writeLoginCookies(response: Response, state: string, verifier: string) {
  response.headers.append("Set-Cookie", serializeCookie(stateCookie, state, 900));
  response.headers.append("Set-Cookie", serializeCookie(verifierCookie, verifier, 900));
}

export async function readLoginCookies() {
  const jar = await cookies();
  return {
    state: jar.get(stateCookie)?.value,
    verifier: jar.get(verifierCookie)?.value,
  };
}

export function getSessionCookieName() {
  return sessionCookie;
}

function serializeAccount(account: AccountInfo) {
  return {
    name: account.name,
    username: account.username,
    localAccountId: account.localAccountId,
  };
}

function normalizeCallbackUrl(value: string) {
  if (!value || value.startsWith("http://") || value.startsWith("https://")) return "/dashboard";
  return value.startsWith("/") ? value : "/dashboard";
}

async function seal<T>(value: T) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getCookieKey(), iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

async function unseal<T>(value: string) {
  try {
    const payload = Buffer.from(value, "base64url");
    const iv = payload.subarray(0, 12);
    const tag = payload.subarray(12, 28);
    const encrypted = payload.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", getCookieKey(), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
    return JSON.parse(plaintext) as T;
  } catch {
    return null;
  }
}

function getCookieKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is required.");
  return crypto.createHash("sha256").update(secret).digest();
}

function serializeCookie(name: string, value: string, maxAge: number) {
  const secure = process.env.AUTH_URL?.startsWith("https://") ? "; Secure" : "";
  return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
