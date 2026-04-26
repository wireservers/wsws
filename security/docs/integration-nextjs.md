# Integrate `@wsws/auth` into a Next.js (App Router) project

This is the same setup used by `bringthe/bring-the-diet/web`.

## 1. Install

Until `@wsws/auth` is published to a private registry (see [publishing.md](publishing.md)),
consume it via a vendored tarball:

```bash
pnpm -C packages/auth pack --pack-destination /path/to/your-project/web/vendor
```

In your web app's `package.json`:

```json
{
  "dependencies": {
    "@azure/msal-browser": "^3.27.0",
    "@azure/msal-react": "^2.2.0",
    "@wsws/auth": "file:./vendor/wsws-auth-0.1.0.tgz"
  }
}
```

## 2. Build the auth config

`web/lib/authConfig.ts`:

```ts
import type { AuthAppConfig } from '@wsws/auth/react';

export function getAuthConfig(): AuthAppConfig | null {
  const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID;
  if (!clientId) return null;
  return {
    clientId,
    tenancy: { mode: 'multi-tenant' },
    scopes: [process.env.NEXT_PUBLIC_API_SCOPE!],
    allowedTenantIds: process.env.NEXT_PUBLIC_ALLOWED_TENANT_IDS?.split(','),
  };
}
```

## 3. Wrap the app

`web/components/AuthProviderWrapper.tsx`:

```tsx
'use client';
import { AuthProvider } from '@wsws/auth/react';
import { getAuthConfig } from '../lib/authConfig';

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const config = getAuthConfig();
  if (!config) return <>{children}</>;
  return <AuthProvider config={config}>{children}</AuthProvider>;
}
```

In `web/components/ClientProviders.tsx`:

```tsx
'use client';
import { AuthProviderWrapper } from './AuthProviderWrapper';
// ...
return (
  <Provider store={store}>
    <AuthProviderWrapper>
      {children}
    </AuthProviderWrapper>
  </Provider>
);
```

## 4. Use it in components

```tsx
'use client';
import { useAuth } from '@wsws/auth/react';

export function Header() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return isAuthenticated
    ? <button onClick={logout}>Sign out {user?.name}</button>
    : <button onClick={login}>Sign in with Microsoft</button>;
}
```

For protected routes:

```tsx
'use client';
import { AuthGuard } from '@wsws/auth/react';

export default function AdminPage() {
  return (
    <AuthGuard requireRoles={['Admin']} fallback={<p>Sign in required</p>} forbidden={<p>403</p>}>
      <AdminDashboard />
    </AuthGuard>
  );
}
```

## 5. Authenticated fetches

```tsx
'use client';
import { useAuth, createFetchWithAuth } from '@wsws/auth/react';
import { useMemo } from 'react';

function useApi() {
  const { getAccessToken } = useAuth();
  return useMemo(() => createFetchWithAuth(getAccessToken), [getAccessToken]);
}
```

## SSR / mock-mode

`<AuthProvider>` is a client component and renders nothing until MSAL initializes — safe under SSR.
If `NEXT_PUBLIC_AZURE_CLIENT_ID` is not set, `getAuthConfig()` returns `null`, the provider is
skipped, and `useAuth()` returns a mock unauthenticated state. This lets dev/CI run without
Entra credentials.

## Static export caveat

If you use `output: 'export'`, MSAL's redirect flow needs `redirectUri` to match the deployed URL.
For `output: 'standalone'` (the default in this repo), no special handling is needed.
