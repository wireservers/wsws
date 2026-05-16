"use client";

import { useCallback, useEffect, useState } from "react";

export type SessionUser = {
  name?: string;
  username?: string;
  localAccountId?: string;
};

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/msal/session", { cache: "no-store" });
      const session = (await response.json()) as { authenticated: boolean; user: SessionUser | null };
      setAuthenticated(session.authenticated);
      setUser(session.user);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(() => {
    const callbackUrl = `${window.location.pathname}${window.location.search}`;
    window.location.href = `/api/msal/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }, []);

  const logout = useCallback(() => {
    window.location.href = "/api/msal/logout";
  }, []);

  return { loading, authenticated, user, login, logout, refresh };
}
