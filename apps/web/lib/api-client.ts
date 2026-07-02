const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const DEFAULT_TIMEOUT = 30_000;

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public body: string,
    public path: string
  ) {
    super(`API ${status} on ${path}: ${body.slice(0, 200)}`);
    this.name = "ApiClientError";
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: { timeout?: number }
): Promise<T> {
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {};
    if (body) headers["Content-Type"] = "application/json";

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new ApiClientError(res.status, text, path);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T>(path: string, options?: { timeout?: number }) =>
    request<T>("GET", path, undefined, options),
  post: <T>(path: string, body?: unknown, options?: { timeout?: number }) =>
    request<T>("POST", path, body, options),
  patch: <T>(path: string, body?: unknown, options?: { timeout?: number }) =>
    request<T>("PATCH", path, body, options),
  put: <T>(path: string, body?: unknown, options?: { timeout?: number }) =>
    request<T>("PUT", path, body, options),
  delete: <T>(path: string, options?: { timeout?: number }) =>
    request<T>("DELETE", path, undefined, options),
};
