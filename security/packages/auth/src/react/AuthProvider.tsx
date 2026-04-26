import {
  EventType,
  InteractionRequiredAuthError,
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
  type EventMessage,
} from '@azure/msal-browser';
import { MsalProvider, useMsal } from '@azure/msal-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { userFromClaims } from '../core/claims.js';
import type { AuthAppConfig, AuthContextValue, AuthUser } from '../core/types.js';
import { buildMsalConfig, defaultLoginRequest } from './msalConfig.js';

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  config: AuthAppConfig;
  children: ReactNode;
  /** Use redirect flow instead of popup. Recommended for mobile / strict popup blockers. */
  useRedirect?: boolean;
}

/**
 * Wrap your app with this. Provides {@link useAuth} to descendants.
 *
 * NOTE: This component is client-only. In Next.js App Router, render it in a "use client"
 * boundary above any consumer of useAuth, and SSR-disable the boundary if MSAL is creating
 * the PublicClientApplication on first paint.
 */
export function AuthProvider({ config, children, useRedirect = false }: AuthProviderProps) {
  const [pca] = useState(() => new PublicClientApplication(buildMsalConfig(config)));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await pca.initialize();
      const result = await pca.handleRedirectPromise();
      if (result?.account) pca.setActiveAccount(result.account);
      else if (!pca.getActiveAccount()) {
        const accounts = pca.getAllAccounts();
        if (accounts[0]) pca.setActiveAccount(accounts[0]);
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [pca]);

  useEffect(() => {
    const id = pca.addEventCallback((message: EventMessage) => {
      if (
        message.eventType === EventType.LOGIN_SUCCESS ||
        message.eventType === EventType.ACQUIRE_TOKEN_SUCCESS
      ) {
        const payload = message.payload as AuthenticationResult | null;
        if (payload?.account) pca.setActiveAccount(payload.account);
      }
    });
    return () => {
      if (id) pca.removeEventCallback(id);
    };
  }, [pca]);

  if (!ready) return null;

  return (
    <MsalProvider instance={pca}>
      <InnerAuthProvider config={config} useRedirect={useRedirect}>
        {children}
      </InnerAuthProvider>
    </MsalProvider>
  );
}

function InnerAuthProvider({
  config,
  useRedirect,
  children,
}: {
  config: AuthAppConfig;
  useRedirect: boolean;
  children: ReactNode;
}) {
  const { instance, accounts, inProgress } = useMsal();
  const [error, setError] = useState<Error | null>(null);

  const account: AccountInfo | undefined = instance.getActiveAccount() ?? accounts[0];
  const allowed = useMemo(() => allowedTenants(config), [config]);

  const user: AuthUser | null = useMemo(() => {
    if (!account?.idTokenClaims) return null;
    if (allowed && account.tenantId && !allowed.has(account.tenantId)) return null;
    return userFromClaims(account.idTokenClaims as Record<string, unknown>);
  }, [account, allowed]);

  const login = useCallback(async () => {
    setError(null);
    try {
      const req = defaultLoginRequest(config);
      if (useRedirect) await instance.loginRedirect(req);
      else await instance.loginPopup(req);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    }
  }, [instance, config, useRedirect]);

  const logout = useCallback(async () => {
    setError(null);
    try {
      const acct = instance.getActiveAccount() ?? accounts[0];
      if (useRedirect) await instance.logoutRedirect({ account: acct });
      else await instance.logoutPopup({ account: acct });
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
      throw e;
    }
  }, [instance, accounts, useRedirect]);

  const getAccessToken = useCallback(
    async (scopes?: string[]): Promise<string | null> => {
      const acct = instance.getActiveAccount() ?? accounts[0];
      if (!acct) return null;
      const req = { account: acct, scopes: scopes ?? defaultLoginRequest(config).scopes };
      try {
        const result = await instance.acquireTokenSilent(req);
        return result.accessToken;
      } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
          if (useRedirect) {
            await instance.acquireTokenRedirect(req);
            return null;
          }
          const result = await instance.acquireTokenPopup(req);
          return result.accessToken;
        }
        setError(e instanceof Error ? e : new Error(String(e)));
        return null;
      }
    },
    [instance, accounts, config, useRedirect]
  );

  const value: AuthContextValue = {
    isAuthenticated: !!user,
    user,
    isLoading: inProgress !== 'none',
    error,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

function allowedTenants(config: AuthAppConfig): Set<string> | null {
  if (!config.allowedTenantIds || config.allowedTenantIds.length === 0) return null;
  return new Set(config.allowedTenantIds);
}
