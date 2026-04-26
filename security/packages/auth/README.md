# @wsws/auth

Shared Entra ID (Azure AD) authentication for WireServers projects. Multi-tenant capable.

## Entry points

| Import | For |
|---|---|
| `@wsws/auth` | Shared types, multi-tenant config helpers, claim parsers |
| `@wsws/auth/react` | React/Next.js: `<AuthProvider>`, `useAuth`, `<AuthGuard>`, `createFetchWithAuth` |
| `@wsws/auth/node` | Node APIs: `createTokenValidator`, `authMiddleware` |

## Quick start (React/Next.js)

```tsx
'use client';
import { AuthProvider } from '@wsws/auth/react';

export function Providers({ children }) {
  return (
    <AuthProvider
      config={{
        clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!,
        tenancy: { mode: 'multi-tenant' },
        scopes: [process.env.NEXT_PUBLIC_API_SCOPE!],
      }}
    >
      {children}
    </AuthProvider>
  );
}
```

```tsx
import { useAuth } from '@wsws/auth/react';

export function Header() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return isAuthenticated ? (
    <button onClick={logout}>Sign out {user?.name}</button>
  ) : (
    <button onClick={login}>Sign in</button>
  );
}
```

## Quick start (Node API)

```ts
import express from 'express';
import { authMiddleware } from '@wsws/auth/node';

const app = express();
app.use(
  '/api',
  authMiddleware({
    config: {
      clientId: process.env.AZURE_API_CLIENT_ID!,
      tenancy: { mode: 'multi-tenant' },
      allowedTenantIds: process.env.ALLOWED_TENANTS?.split(','),
    },
    audience: process.env.AZURE_API_AUDIENCE!,
    requiredScopes: ['access_as_user'],
  })
);
app.get('/api/me', (req, res) => res.json(req.auth));
```

## Tenancy modes

```ts
{ mode: 'single-tenant', tenantId: '<guid>' }       // one tenant only
{ mode: 'multi-tenant' }                            // any work/school account
{ mode: 'multi-tenant-and-personal' }               // any MSA + work/school
```

For multi-tenant registrations, gate which customer tenants are actually allowed via
`allowedTenantIds` — the SDK enforces this on both the React side (rejects users from
disallowed tenants) and the Node side (rejects tokens with a disallowed `tid`).

See [docs/entra-setup.md](../../docs/entra-setup.md) for app-registration steps.
