#!/usr/bin/env bash
# Register a multi-tenant Entra app for a SPA + its API. Requires `az` CLI logged in
# as a tenant admin.
#
# Usage:
#   ./register-entra-app.sh <spa-name> <api-name> <spa-redirect-uri>
# Example:
#   ./register-entra-app.sh bring-the-diet-web bring-the-diet-api http://localhost:3001
set -euo pipefail

SPA_NAME=${1:?spa name required}
API_NAME=${2:?api name required}
SPA_REDIRECT=${3:?spa redirect uri required}

echo "==> Creating API registration: $API_NAME"
API_APP_JSON=$(az ad app create \
  --display-name "$API_NAME" \
  --sign-in-audience AzureADMultipleOrgs)
API_APP_ID=$(echo "$API_APP_JSON" | jq -r '.appId')
API_OBJECT_ID=$(echo "$API_APP_JSON" | jq -r '.id')

echo "    API client ID: $API_APP_ID"

echo "==> Setting Application ID URI: api://$API_APP_ID"
az ad app update --id "$API_APP_ID" --identifier-uris "api://$API_APP_ID"

SCOPE_GUID=$(uuidgen)
echo "==> Adding scope access_as_user"
az ad app update --id "$API_APP_ID" --set api="{
  \"oauth2PermissionScopes\": [{
    \"adminConsentDescription\": \"Allow the app to access $API_NAME on behalf of the signed-in user\",
    \"adminConsentDisplayName\": \"Access $API_NAME as user\",
    \"id\": \"$SCOPE_GUID\",
    \"isEnabled\": true,
    \"type\": \"User\",
    \"value\": \"access_as_user\"
  }]
}"

echo "==> Creating SPA registration: $SPA_NAME"
SPA_APP_JSON=$(az ad app create \
  --display-name "$SPA_NAME" \
  --sign-in-audience AzureADMultipleOrgs \
  --spa-redirect-uris "$SPA_REDIRECT")
SPA_APP_ID=$(echo "$SPA_APP_JSON" | jq -r '.appId')

echo "    SPA client ID: $SPA_APP_ID"

echo "==> Granting SPA permission to call the API"
az ad app permission add --id "$SPA_APP_ID" \
  --api "$API_APP_ID" \
  --api-permissions "$SCOPE_GUID=Scope"

cat <<EOF

============================================================
Registration complete.

SPA env vars:
  NEXT_PUBLIC_AZURE_CLIENT_ID=$SPA_APP_ID
  NEXT_PUBLIC_AZURE_TENANCY=multi-tenant
  NEXT_PUBLIC_API_SCOPE=api://$API_APP_ID/access_as_user

API env vars:
  AZURE_API_CLIENT_ID=$API_APP_ID
  AZURE_API_AUDIENCE=api://$API_APP_ID

Next steps:
  1. In the Azure portal, grant admin consent for the SPA's API permissions.
  2. (Optional) Add app roles to the API registration for AuthGuard.
  3. (Optional) Add additional redirect URIs for prod environments.
============================================================
EOF
