# Entra ID app registration (multi-tenant)

Register one app for each client (the SPA) and one for each backend API. The SPA requests an
access token whose audience is the API.

## 1. Register the SPA

In the [Azure portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations** → **New registration**:

| Field | Value |
|---|---|
| Name | `bring-the-diet-web` (or your project name) |
| Supported account types | **Accounts in any organizational directory (Multitenant)** for `multi-tenant`, OR **Accounts in any directory and personal Microsoft accounts** for `multi-tenant-and-personal` |
| Redirect URI | **Single-page application** → `https://your-app.com` (and `http://localhost:3001` for dev) |

After creation:

1. **Authentication** tab → ensure the redirect URI is registered as type **Single-page application** (enables PKCE; do *not* tick "ID tokens" implicit grant — modern MSAL.js does PKCE).
2. **Authentication** tab → enable **Front-channel logout URL** if you want sign-out to clear other apps.
3. Copy the **Application (client) ID** → goes into `NEXT_PUBLIC_AZURE_CLIENT_ID`.

## 2. Register the API

Repeat the registration for the API:

| Field | Value |
|---|---|
| Name | `bring-the-diet-api` |
| Supported account types | Same as the SPA |
| Redirect URI | leave empty |

After creation:

1. **Expose an API** tab → set **Application ID URI** to `api://<api-client-id>` (default).
2. **Add a scope** → name `access_as_user`, admin consent display name "Access API as the signed-in user".
3. Copy the full scope string (`api://<api-client-id>/access_as_user`) → goes into `NEXT_PUBLIC_API_SCOPE` for the SPA.

## 3. Grant the SPA permission to call the API

Back in the SPA registration:

1. **API permissions** → **Add a permission** → **My APIs** → pick the API registration → tick `access_as_user` → **Add permissions**.
2. **Grant admin consent for <your-tenant>** (only available if you're a tenant admin; for multi-tenant scenarios, each customer admin grants consent on first sign-in).

## 4. (Optional) App roles for authorization

To use `requireRoles` in `<AuthGuard>`:

1. On the **API registration** → **App roles** → **Create app role**.
2. Name like `Admin`, `Editor`. Allowed member types: **Users/Groups**.
3. Assign roles to users via **Enterprise applications** → the API → **Users and groups**.
4. The `roles` claim will then appear in tokens issued for the API.

## 5. (Multi-tenant) Restrict to specific customer tenants

A multi-tenant registration accepts users from *any* tenant. To scope to a vetted list, set
`NEXT_PUBLIC_ALLOWED_TENANT_IDS=tid1,tid2,...` in the SPA and pass `allowedTenantIds` to
`authMiddleware` on the API. The SDK rejects users / tokens whose `tid` is not in the list.

## 6. Environment variables

```bash
# SPA (.env.local)
NEXT_PUBLIC_AZURE_CLIENT_ID=<spa-client-id>
NEXT_PUBLIC_AZURE_TENANCY=multi-tenant         # or single-tenant | multi-tenant-and-personal
NEXT_PUBLIC_AZURE_TENANT_ID=                   # only required for single-tenant
NEXT_PUBLIC_API_SCOPE=api://<api-client-id>/access_as_user
NEXT_PUBLIC_ALLOWED_TENANT_IDS=                # optional comma-separated allowlist

# API (.env)
AZURE_API_CLIENT_ID=<api-client-id>
AZURE_API_AUDIENCE=api://<api-client-id>
ALLOWED_TENANT_IDS=                            # optional comma-separated allowlist
```

## Common gotchas

- **AADSTS50011: redirect URI mismatch** — the SPA's redirect URI in Entra must match the URL in
  the browser exactly, including scheme and port. Add `http://localhost:3001` for dev.
- **No `roles` claim** — assign the role via *Enterprise applications* (the service principal),
  not the *App registration*. Roles defined on the registration aren't emitted unless someone is
  assigned.
- **Multi-tenant: "AADSTS90072: User not in tenant"** — the user signed in successfully to their
  home tenant, but you're using a single-tenant authority. Switch `NEXT_PUBLIC_AZURE_TENANCY` to
  `multi-tenant`.
- **`tid` claim missing on personal MS accounts** — personal accounts use a synthetic
  `9188040d-6c67-4c5b-b112-36a304b66dad` tenant. Allowlist it explicitly if you want to admit them.
