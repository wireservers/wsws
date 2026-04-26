import type { TenancyMode } from './types.js';

/**
 * Resolve the OAuth authority URL Entra expects.
 * See: https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols
 */
export function resolveAuthority(tenancy: TenancyMode): string {
  switch (tenancy.mode) {
    case 'single-tenant':
      return `https://login.microsoftonline.com/${tenancy.tenantId}`;
    case 'multi-tenant':
      return 'https://login.microsoftonline.com/organizations';
    case 'multi-tenant-and-personal':
      return 'https://login.microsoftonline.com/common';
  }
}

/**
 * The token issuer to expect from Entra for this tenancy mode. Used by server-side
 * validators when verifying `iss`. For multi-tenant scenarios, the issuer varies by
 * tenant — callers should use {@link issuerMatches} instead of strict equality.
 */
export function expectedIssuerPrefix(tenancy: TenancyMode): string {
  if (tenancy.mode === 'single-tenant') {
    return `https://login.microsoftonline.com/${tenancy.tenantId}/v2.0`;
  }
  return 'https://login.microsoftonline.com/';
}

export function issuerMatches(issuer: string, tenancy: TenancyMode): boolean {
  if (tenancy.mode === 'single-tenant') {
    return issuer === expectedIssuerPrefix(tenancy);
  }
  return /^https:\/\/login\.microsoftonline\.com\/[^/]+\/v2\.0$/.test(issuer);
}
