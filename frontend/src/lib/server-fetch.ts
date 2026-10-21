import { getNewAccessToken } from "@/services/auth/auth.service";
import { getCookie } from "@/services/auth/tokenHandlers";

const BACKEND_API_URL =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:5000/api/v1";

const serverFetchHelper = async (endpoint: string, options: RequestInit): Promise<Response> => {
    const { headers, ...restOptions } = options;

    // Refresh FIRST (skipped for the refresh call itself to stop recursion),
    // then read the cookie so the request carries the fresh token.
    if (endpoint !== "/auth/refresh-token") {
        await getNewAccessToken();
    }
    const accessToken = await getCookie("accessToken");

    const defaultHeaders: Record<string, string> = {};
    if (accessToken) {
        defaultHeaders.Cookie = `accessToken=${accessToken}`;
        defaultHeaders.Authorization = `Bearer ${accessToken}`;
    }
    if (typeof restOptions.body === "string") {
        defaultHeaders["Content-Type"] = "application/json";
    }

    return fetch(`${BACKEND_API_URL}${endpoint}`, {
        cache: "no-store",
        ...restOptions,
        headers: {
            ...defaultHeaders,
            ...(headers as Record<string, string> | undefined),
        },
    });
};

export const serverFetch = {
    get: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "GET" }),

    post: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "POST" }),

    put: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "PUT" }),

    patch: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "PATCH" }),

    delete: async (endpoint: string, options: RequestInit = {}): Promise<Response> =>
        serverFetchHelper(endpoint, { ...options, method: "DELETE" }),
};

/**
 * serverFetch.get("/auth/me")
 * serverFetch.post("/auth/login", { body: JSON.stringify({}) })
 */
