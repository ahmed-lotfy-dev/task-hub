const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Server-side fetch function that forwards cookies from the request headers.
 * Use this in TanStack Start loaders to maintain authentication on the server.
 */
export async function serverFetch<T>(path: string, request: Request, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  // Forward the Cookie header from the incoming request to maintain session
  const cookieHeader = request.headers.get('Cookie') || request.headers.get('cookie');

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(cookieHeader && { Cookie: cookieHeader }),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
