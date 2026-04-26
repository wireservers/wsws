import type { Configuration } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';
import type { AuthAppConfig } from '../core/types.js';
import { resolveAuthority } from '../core/authority.js';

export function buildMsalConfig(config: AuthAppConfig): Configuration {
  const redirectUri =
    config.redirectUri ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const postLogoutRedirectUri =
    config.postLogoutRedirectUri ?? (typeof window !== 'undefined' ? window.location.origin : '');

  return {
    auth: {
      clientId: config.clientId,
      authority: resolveAuthority(config.tenancy),
      knownAuthorities: ['login.microsoftonline.com'],
      redirectUri,
      postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Warning,
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) return;
          if (level === LogLevel.Error) console.error('[msal]', message);
          else if (level === LogLevel.Warning) console.warn('[msal]', message);
        },
      },
    },
  };
}

export function defaultLoginRequest(config: AuthAppConfig): { scopes: string[] } {
  return { scopes: config.scopes ?? ['User.Read'] };
}
