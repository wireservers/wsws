# wsws/security

Shared authentication & identity for WireServers projects. Built around Microsoft Entra ID
(Azure AD) with first-class multi-tenant support.

## Why a shared package, not an auth microservice?

Every framework you use (React/Next.js, Angular, React Native, Node, .NET) has a Microsoft-supported
MSAL library. The actual reusable surface is configuration + thin wrappers — not a running service.

A shared package wins for 4–5 client apps. A BFF/identity-service starts to pay off if you need
centralized session storage, audit logs, custom claim enrichment, or to hide access tokens from
browsers (token-handler pattern). When that day comes, the shared package can keep being used by
the BFF; clients then talk to the BFF instead of Entra directly.

## Layout

```
security/
├── packages/
│   └── auth/                 # @wsws/auth — TypeScript SDK
│       ├── src/core/         # tenancy types, authority resolver, claim parser
│       ├── src/react/        # AuthProvider, useAuth, AuthGuard, fetch helper
│       └── src/node/         # JWT validator + Express middleware
├── docs/
│   ├── entra-setup.md        # multi-tenant app registration walkthrough
│   ├── integration-nextjs.md # how to integrate into a Next.js project
│   └── publishing.md         # how to publish to a private registry
└── scripts/
    └── register-entra-app.sh # az-cli helper for multi-tenant registration
```

## Quick links

- Package usage: [packages/auth/README.md](packages/auth/README.md)
- Register your Entra app: [docs/entra-setup.md](docs/entra-setup.md)
- Wire up a Next.js project: [docs/integration-nextjs.md](docs/integration-nextjs.md)
- Publish a new version: [docs/publishing.md](docs/publishing.md)

## Development

```bash
pnpm install
pnpm build
pnpm -C packages/auth pack    # produces tarball for local file: dependencies
```

## Versioning

Single package today (`@wsws/auth`). When other framework adapters are needed (Angular,
React Native), add them as siblings under `packages/` (e.g. `@wsws/auth-angular`).
