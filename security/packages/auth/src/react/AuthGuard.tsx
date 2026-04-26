import type { ReactNode } from 'react';
import { useAuth } from './AuthProvider.js';

interface AuthGuardProps {
  /** Required app roles. User must have ALL listed roles. */
  requireRoles?: string[];
  /** Required group ids. User must have ALL listed groups. */
  requireGroups?: string[];
  /** Rendered while MSAL is initializing or interaction is in progress. */
  loading?: ReactNode;
  /** Rendered when user is not signed in. */
  fallback?: ReactNode;
  /** Rendered when signed in but missing required roles/groups. */
  forbidden?: ReactNode;
  children: ReactNode;
}

export function AuthGuard({
  requireRoles,
  requireGroups,
  loading = null,
  fallback = null,
  forbidden = null,
  children,
}: AuthGuardProps) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) return <>{loading}</>;
  if (!isAuthenticated || !user) return <>{fallback}</>;

  if (requireRoles && !requireRoles.every(r => user.roles.includes(r))) return <>{forbidden}</>;
  if (requireGroups && !requireGroups.every(g => user.groups.includes(g))) return <>{forbidden}</>;

  return <>{children}</>;
}
