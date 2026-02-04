const isServer = import.meta.env.SSR;
const API_BASE_URL = isServer
  ? (process.env.VITE_API_URL || "http://api:8000")
  : "";

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const url = isServer
    ? `${API_BASE_URL}/api${normalizedPath}`
    : normalizedPath;

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
