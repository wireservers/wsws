import type { AuthUser } from './types.js';

/**
 * Map an Entra ID token claims object into our internal {@link AuthUser} shape.
 * Tolerates missing fields — different tenancy modes and account types emit different claims.
 */
export function userFromClaims(claims: Record<string, unknown>): AuthUser | null {
  const oid = asString(claims.oid) ?? asString(claims.sub);
  const tid = asString(claims.tid);
  if (!oid || !tid) return null;

  const name = asString(claims.name) ?? '';
  const username =
    asString(claims.preferred_username) ?? asString(claims.upn) ?? asString(claims.email) ?? '';
  const email = asString(claims.email) ?? username;

  return {
    id: oid,
    tenantId: tid,
    name,
    email,
    username,
    roles: asStringArray(claims.roles),
    groups: asStringArray(claims.groups),
    claims,
  };
}

function asString(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string');
}
