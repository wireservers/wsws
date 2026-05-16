# Wireservers Template

Shell Next.js app that mirrors the BringThe Diet app structure and uses the
same server-side MSAL flow as `ws-security`.

## Run

```bash
cd web
cp .env.local.example .env.local
pnpm install
pnpm dev
```

The app runs on `http://localhost:3002`.

## Auth

MSAL runs as a backend-for-frontend flow:

- `/api/msal/login` starts authorization-code + PKCE.
- `/api/msal/callback` exchanges the code and stores an encrypted HttpOnly
  session cookie.
- `/api/msal/logout` clears local cookies and redirects to Entra logout.
- server API calls use the encrypted session to attach a bearer token to the
  Azure `ws-security` API endpoint.

Set `AUTH_MICROSOFT_ENTRA_ID_ID` and `AUTH_MICROSOFT_ENTRA_ID_SECRET` from the
web app registration before signing in.

## Azure Deployment

GitHub Actions workflows live in `.github/workflows/`:

- The WSWS monorepo uses the root workflow
  `.github/workflows/develop_wireservers-template.yml` to deploy `develop` to
  the `wireservers-template` Azure Web App.
- `develop_wireservers-template-dev.yml` is retained for a future standalone
  `wireservers-template` repository and also targets `wireservers-template`.
- `main_wireservers-template.yml` deploys `main` to the
  `wireservers-template` Azure Web App.

Create these GitHub repository secrets for OIDC login:

```text
AZUREAPPSERVICE_CLIENTID_WIRESERVERS_TEMPLATE
AZUREAPPSERVICE_TENANTID_WIRESERVERS_TEMPLATE
AZUREAPPSERVICE_SUBSCRIPTIONID_WIRESERVERS_TEMPLATE
```

Configure the Azure Web App stack as Node 24 LTS and set startup command to:

```bash
node web/server.js
```

Set these App Service environment variables per environment:

```text
AUTH_SECRET
AUTH_URL
AUTH_MICROSOFT_ENTRA_ID_ID
AUTH_MICROSOFT_ENTRA_ID_SECRET
AUTH_MICROSOFT_ENTRA_ID_ISSUER
NEXT_PUBLIC_API_SCOPE
NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_PURPOSE_OF_USE
```
