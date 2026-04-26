import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { issuerMatches } from '../core/authority.js';
import type { AuthAppConfig } from '../core/types.js';

export interface ValidatedToken {
  /** The verified JWT claims. */
  claims: JWTPayload & Record<string, unknown>;
  /** Tenant the token was issued from (`tid` claim). */
  tenantId: string;
  /** Stable user id (`oid` claim). */
  userId: string;
  /** App roles assigned to the user. */
  roles: string[];
}

export interface TokenValidatorOptions {
  config: AuthAppConfig;
  /**
   * Audience to require in `aud`. Usually your API's app-id-URI (e.g. `api://<api-client-id>`)
   * or the API's clientId itself. If omitted, audience is not checked (NOT recommended).
   */
  audience?: string;
  /**
   * Expected scope or app role. If provided, `scp` (delegated) or `roles` (app) must include
   * at least one of these values.
   */
  requiredScopes?: string[];
}

/**
 * Build a token validator for an Entra-issued access token. Caches JWKS internally.
 *
 * Multi-tenant note: when `config.tenancy` is `multi-tenant`, JWKS is fetched from the
 * `common` keys endpoint, which serves the union of all tenant signing keys. The validator
 * then enforces `tid` against `config.allowedTenantIds` if provided.
 */
export function createTokenValidator(opts: TokenValidatorOptions) {
  const { config, audience, requiredScopes } = opts;
  const jwksUri = jwksUriFor(config);
  const jwks = createRemoteJWKSet(new URL(jwksUri));
  const allowedTenants = config.allowedTenantIds && new Set(config.allowedTenantIds);

  return async function validate(token: string): Promise<ValidatedToken> {
    const { payload } = await jwtVerify(token, jwks, {
      audience,
      algorithms: ['RS256'],
    });

    const iss = typeof payload.iss === 'string' ? payload.iss : '';
    if (!issuerMatches(iss, config.tenancy)) {
      throw new Error(`Invalid issuer: ${iss}`);
    }

    const tid = typeof payload.tid === 'string' ? payload.tid : '';
    if (!tid) throw new Error('Token missing tid claim');
    if (allowedTenants && !allowedTenants.has(tid)) {
      throw new Error(`Tenant ${tid} not in allowedTenantIds`);
    }

    if (requiredScopes && requiredScopes.length > 0) {
      const scp = typeof payload.scp === 'string' ? payload.scp.split(' ') : [];
      const roles = Array.isArray(payload.roles) ? (payload.roles as string[]) : [];
      const tokenPerms = new Set([...scp, ...roles]);
      if (!requiredScopes.some(s => tokenPerms.has(s))) {
        throw new Error(`Token missing required scope/role: ${requiredScopes.join(', ')}`);
      }
    }

    const oid = typeof payload.oid === 'string' ? payload.oid : (payload.sub as string);
    if (!oid) throw new Error('Token missing oid/sub claim');

    return {
      claims: payload as ValidatedToken['claims'],
      tenantId: tid,
      userId: oid,
      roles: Array.isArray(payload.roles) ? (payload.roles as string[]) : [],
    };
  };
}

function jwksUriFor(config: AuthAppConfig): string {
  if (config.tenancy.mode === 'single-tenant') {
    return `https://login.microsoftonline.com/${config.tenancy.tenantId}/discovery/v2.0/keys`;
  }
  if (config.tenancy.mode === 'multi-tenant') {
    return 'https://login.microsoftonline.com/organizations/discovery/v2.0/keys';
  }
  return 'https://login.microsoftonline.com/common/discovery/v2.0/keys';
}
