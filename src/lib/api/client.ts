import { getApiBaseUrl } from "./config";
import { refreshAccessToken } from "./token";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

type RequestOptions = RequestInit & {
  token?: string | null;
  searchParams?: Record<string, string | number | undefined | null>;
};

function buildUrl(path: string, searchParams?: RequestOptions["searchParams"]) {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const target = `${base}${normalizedPath}`;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.API_PROXY_TARGET ?? "http://localhost:3000";

  const url =
    target.startsWith("http://") || target.startsWith("https://")
      ? new URL(target)
      : new URL(target, origin);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function executeRequest<T>(
  path: string,
  options: RequestOptions,
): Promise<{ response: Response; payload: ApiResponse<T> }> {
  const { token, searchParams, headers, ...init } = options;
  const url = buildUrl(path, searchParams);

  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: init.cache ?? "no-store",
  });

  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok && !("success" in payload)) {
    return {
      response,
      payload: {
        success: false,
        error: {
          code: "HTTP_ERROR",
          message: `Request failed with status ${response.status}`,
        },
      },
    };
  }

  return { response, payload };
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  let { response, payload } = await executeRequest<T>(path, options);

  if (
    response.status === 401 &&
    options.token &&
    !path.startsWith("/auth/")
  ) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      ({ response, payload } = await executeRequest<T>(path, {
        ...options,
        token: newToken,
      }));
    }
  }

  return payload;
}

export async function apiGet<T>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">,
) {
  return apiRequest<T>(path, { ...options, method: "GET" });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">,
) {
  return apiRequest<T>(path, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  options?: Omit<RequestOptions, "method" | "body">,
) {
  return apiRequest<T>(path, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function apiDelete<T>(
  path: string,
  options?: Omit<RequestOptions, "method" | "body">,
) {
  return apiRequest<T>(path, { ...options, method: "DELETE" });
}
