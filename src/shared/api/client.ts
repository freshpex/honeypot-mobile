import { env } from "@/config";
import { getAuthSession } from "@/shared/storage";

type RequestOptions<TBody> = {
  body?: TBody;
  headers?: Record<string, string>;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const request = async <TResponse, TBody = unknown>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  options: RequestOptions<TBody> = {},
): Promise<TResponse> => {
  const session = await getAuthSession();
  let response: Response;
  try {
    response = await fetch(`${env.API_BASE_URL}${path}`, {
      credentials: "include",
      method,
      headers: {
        ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch (error) {
    throw new ApiClientError(
      networkErrorMessage(error),
      0,
    );
  }

  const data = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new ApiClientError(errorMessageFromResponse(data), response.status);
  }

  return data as TResponse;
};

export const apiClient = {
  baseUrl: env.API_BASE_URL,
  get: <TResponse>(path: string) => request<TResponse>(path, "GET"),
  post: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, "POST", { body }),
  put: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, "PUT", { body }),
  patch: <TResponse, TBody = unknown>(path: string, body: TBody) =>
    request<TResponse, TBody>(path, "PATCH", { body }),
  delete: <TResponse>(path: string) => request<TResponse>(path, "DELETE"),
};

const networkErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : "";
  if (/localhost|Network request failed|host name|ENOTFOUND|fetch failed/i.test(message)) {
    return "Unable to reach HoneyPot API. Check EXPO_PUBLIC_API_BASE_URL for this build and try again.";
  }
  return "Unable to reach HoneyPot API. Please check your connection and try again.";
};

const errorMessageFromResponse = (data: unknown) => {
  if (!data || typeof data !== "object") return "Request failed";
  const message = (data as { message?: unknown; error?: unknown; code?: unknown }).message;
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    const nested = message as { message?: unknown; error?: unknown };
    if (typeof nested.message === "string") return nested.message;
    if (typeof nested.error === "string") return nested.error;
  }
  const error = (data as { error?: unknown }).error;
  if (typeof error === "string") return error;
  const code = (data as { code?: unknown }).code;
  return typeof code === "string" ? code.replace(/_/g, " ") : "Request failed";
};

