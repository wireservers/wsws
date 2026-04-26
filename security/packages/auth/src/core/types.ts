/**
 * Authority targeting strategy for Entra ID.
 *
 * - `single-tenant`: only users from one specific tenant can sign in. Set `tenantId`.
 * - `multi-tenant`: any work/school account from any Entra tenant can sign in. Use `organizations`.
 * - `multi-tenant-and-personal`: any work/school OR personal Microsoft account. Use `common`.
 *   This is the broadest audience and is appropriate for consumer-facing apps.
 */
export type TenancyMode =
  | { mode: 'single-tenant'; tenantId: string }
  | { mode: 'multi-tenant' }
  | { mode: 'multi-tenant-and-personal' };

export interface AuthAppConfig {
  /** Entra app registration (client) ID. */
  clientId: string;
  /** Tenancy targeting. */
  tenancy: TenancyMode;
  /**
   * OAuth scopes the app requests for its OWN API. Format: `api://<api-client-id>/<scope>` or
   * a fully-qualified Microsoft Graph scope like `User.Read`.
   * Defaults to `['User.Read']` if not provided.
   */
  scopes?: string[];
  /**
   * Optional list of allowed tenant IDs. Server-side guards should reject tokens whose
   * `tid` claim is not in this list. Use this to gate a multi-tenant registration to
   * specific customer tenants without re-registering.
   */
  allowedTenantIds?: string[];
  /** Redirect URI registered with Entra. Defaults to `window.location.origin` at runtime. */
  redirectUri?: string;
  /** Post-logout redirect URI. Defaults to `window.location.origin`. */
  postLogoutRedirectUri?: string;
}

export interface AuthUser {
  /** Stable user identifier (`oid` claim — same across tokens for the same user). */
  id: string;
  /** Tenant the user signed in from (`tid` claim). */
  tenantId: string;
  /** Display name (`name` claim). */
  name: string;
  /** Email or UPN. */
  email: string;
  /** Username (`preferred_username` — usually email-like). */
  username: string;
  /** Roles assigned via app role assignments (`roles` claim). */
  roles: string[];
  /** Groups the user is a member of (`groups` claim — only present if app is configured to emit them). */
  groups: string[];
  /** Raw ID token claims, in case callers need something we didn't surface. */
  claims: Record<string, unknown>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  /** True while MSAL is initializing or a redirect/popup is in flight. */
  isLoading: boolean;
  /** Last error from a sign-in / acquire-token attempt. */
  error: Error | null;
}

export interface AuthActions {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  /** Acquire an access token for the configured `scopes` (or override per call). */
  getAccessToken: (scopes?: string[]) => Promise<string | null>;
}

export type AuthContextValue = AuthState & AuthActions;
