const API_BASE_URL = (import.meta.env.VITE_BACKEND_API_URL ?? "").replace(/\/+$/, "");

type ApiFetchOptions = RequestInit & {
  baseUrl?: string;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const baseUrl = (options.baseUrl ?? API_BASE_URL).replace(/\/+$/, "");
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const body = options.body;
  if (body && !(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: options.credentials ?? "include",
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = `${response.status} ${response.statusText}`;

    try {
      if (contentType.includes("application/json")) {
        const data = await response.json();
        message = data?.error || data?.message || message;
      } else {
        const text = await response.text();
        if (text) message = text;
      }
    } catch {
      // Ignore parse errors and use default message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}
