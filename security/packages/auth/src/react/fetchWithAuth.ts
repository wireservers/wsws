/**
 * Build a fetch wrapper bound to a token source. The returned function attaches
 * `Authorization: Bearer <token>` to every request.
 *
 * @example
 *   const fetchWithAuth = createFetchWithAuth(() => getAccessToken());
 *   await fetchWithAuth('/api/recipes');
 */
export function createFetchWithAuth(
  getToken: () => Promise<string | null>
): typeof fetch {
  return async (input, init) => {
    const token = await getToken();
    const headers = new Headers(init?.headers);
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(input, { ...init, headers });
  };
}
