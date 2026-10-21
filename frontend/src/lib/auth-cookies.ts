import { parseCookie } from "cookie";

type ParsedCookie = Record<string, string | undefined>;

const isProd = process.env.NODE_ENV === "production";

// maxAge is in SECONDS
const ACCESS_FALLBACK_MAX_AGE = 60 * 60; // 1 hour
const REFRESH_FALLBACK_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const buildCookieOptions = (cookie: ParsedCookie, fallbackMaxAge: number) => ({
    secure: isProd,
    httpOnly: true,
    maxAge: parseInt(cookie["Max-Age"] ?? "") || fallbackMaxAge,
    path: cookie.Path || "/",
    sameSite: (cookie.SameSite ?? "lax").toLowerCase() as "lax" | "strict" | "none",
});

// Reads both tokens out of a backend response's Set-Cookie headers
export const extractAuthCookies = (response: Response) => {
    const setCookieHeaders = response.headers.getSetCookie();

    if (!setCookieHeaders || setCookieHeaders.length === 0) {
        throw new Error("No Set-Cookie header found");
    }

    let access: ParsedCookie | null = null;
    let refresh: ParsedCookie | null = null;

    for (const header of setCookieHeaders) {
        const parsed = parseCookie(header) as ParsedCookie;
        if (parsed.accessToken) access = parsed;
        if (parsed.refreshToken) refresh = parsed;
    }

    if (!access || !refresh) {
        throw new Error("Tokens not found in cookies");
    }

    return {
        accessToken: {
            value: access.accessToken!,
            options: buildCookieOptions(access, ACCESS_FALLBACK_MAX_AGE),
        },
        refreshToken: {
            value: refresh.refreshToken!,
            options: buildCookieOptions(refresh, REFRESH_FALLBACK_MAX_AGE),
        },
    };
};
