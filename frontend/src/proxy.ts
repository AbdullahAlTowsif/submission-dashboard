import { extractAuthCookies } from "@/lib/auth-cookies";
import {
    getDefaultDashboardRoute,
    getRouteOwner,
    isAuthRoute,
    type PersonRole,
} from "@/lib/auth-utils";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:4000/api/v1";

const verifyToken = (token?: string) => {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_SECRET!, {
            algorithms: ["HS256"],
        }) as jwt.JwtPayload;
    } catch {
        return null;
    }
};

const refreshTokens = async (refreshToken: string) => {
    try {
        const response = await fetch(`${BACKEND_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${refreshToken}` },
            cache: "no-store",
        });
        if (!response.ok) return null;
        return extractAuthCookies(response);
    } catch {
        return null;
    }
};

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let payload = verifyToken(accessToken);
    let refreshed: Awaited<ReturnType<typeof refreshTokens>> = null;

    // Access token missing/expired but a refresh token exists: refresh once here,
    // because Server Components cannot write cookies.
    if (!payload && refreshToken) {
        refreshed = await refreshTokens(refreshToken);
        if (refreshed) {
            payload = verifyToken(refreshed.accessToken.value);
            // Let Server Components in THIS request see the new tokens
            request.cookies.set("accessToken", refreshed.accessToken.value);
            request.cookies.set("refreshToken", refreshed.refreshToken.value);
        }
    }

    const hasStaleCookies = !payload && Boolean(accessToken || refreshToken);

    // Attach refreshed cookies (or clear dead ones) to whatever response we return
    const finalize = (response: NextResponse) => {
        if (refreshed) {
            response.cookies.set(
                "accessToken",
                refreshed.accessToken.value,
                refreshed.accessToken.options
            );
            response.cookies.set(
                "refreshToken",
                refreshed.refreshToken.value,
                refreshed.refreshToken.options
            );
        } else if (hasStaleCookies) {
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
        }
        return response;
    };

    const role = payload?.role as PersonRole | undefined;

    // 1. Logged-in users don't need /login or /signup
    if (isAuthRoute(pathname) && role) {
        return finalize(
            NextResponse.redirect(new URL(getDefaultDashboardRoute(role), request.url))
        );
    }

    const routeOwner = getRouteOwner(pathname);

    // 2. Public page
    if (routeOwner === null) {
        return finalize(NextResponse.next({ request }));
    }

    // 3. Protected page but not logged in
    if (!role) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return finalize(NextResponse.redirect(loginUrl));
    }

    // 4. Logged in, but this page belongs to the other role
    if (routeOwner !== "COMMON" && routeOwner !== role) {
        return finalize(
            NextResponse.redirect(new URL(getDefaultDashboardRoute(role), request.url))
        );
    }

    return finalize(NextResponse.next({ request }));
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
