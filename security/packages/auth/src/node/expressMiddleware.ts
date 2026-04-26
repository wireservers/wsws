import type { TokenValidatorOptions, ValidatedToken } from './validateToken.js';
import { createTokenValidator } from './validateToken.js';

interface ReqLike {
  headers: Record<string, string | string[] | undefined>;
}

interface ResLike {
  status(code: number): ResLike;
  json(body: unknown): unknown;
}

type NextFn = (err?: unknown) => void;

/**
 * Express-compatible middleware that verifies the bearer token, attaches the validated
 * principal to `req.auth`, and rejects with 401/403 on failure.
 *
 * Typed loosely against `ReqLike`/`ResLike` so it works with Express, Fastify, Hono adapters,
 * etc. without forcing a hard dependency on a specific framework.
 */
export function authMiddleware(opts: TokenValidatorOptions) {
  const validate = createTokenValidator(opts);
  return async function (req: ReqLike, res: ResLike, next: NextFn): Promise<void> {
    const header = req.headers['authorization'];
    const auth = Array.isArray(header) ? header[0] : header;
    if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
      res.status(401).json({ error: 'missing_bearer_token' });
      return;
    }
    const token = auth.slice(7).trim();
    try {
      const principal = await validate(token);
      (req as ReqLike & { auth: ValidatedToken }).auth = principal;
      next();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'invalid_token';
      res.status(401).json({ error: 'invalid_token', detail: msg });
    }
  };
}

// Consumer-side type augmentation example for Express:
//   declare module 'express-serve-static-core' {
//     interface Request { auth?: import('@wsws/auth/node').ValidatedToken }
//   }
