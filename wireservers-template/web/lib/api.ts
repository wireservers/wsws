import { getMsalAccessToken } from "@/lib/msalAuth";

export type Me = {
  id: string;
  email: string;
  displayName: string;
  department: string;
  clearanceLevel: string;
  region: string;
  roles: { name: string; scope: string | null }[];
  permissions: string[];
};

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getMsalAccessToken();
  if (!token) throw new Error("Not authenticated");

  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://ws-security.azurewebsites.net";
  const existingHeaders = new Headers(init.headers);
  if (!existingHeaders.has("X-Purpose-Of-Use")) {
    existingHeaders.set("X-Purpose-Of-Use", process.env.NEXT_PUBLIC_PURPOSE_OF_USE ?? "operations");
  }

  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...Object.fromEntries(existingHeaders.entries()),
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.headers.get("www-authenticate") ?? ""} ${await response.text()}`);
  }

  return (await response.json()) as T;
}

export async function getMe() {
  return apiFetch<Me>("/api/me");
}
