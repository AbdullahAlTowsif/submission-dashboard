"use server";

import { extractAuthCookies } from "@/lib/auth-cookies";
import {
    getDefaultDashboardRoute,
    isValidRedirectForRole,
    type PersonRole,
} from "@/lib/auth-utils";
import { verifyAccessToken } from "@/lib/jwtHandlers";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import type { IActionState } from "@/types/api.interface";
import type { IUser } from "@/types/user.interface";
import { loginZodSchema, registerZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";
import { deleteCookie, getCookie, setCookie } from "./tokenHandlers";

// ---------- internal helpers (not exported) ----------

const storeTokensFromResponse = async (response: Response) => {
    const { accessToken, refreshToken } = extractAuthCookies(response);
    await setCookie("accessToken", accessToken.value, accessToken.options);
    await setCookie("refreshToken", refreshToken.value, refreshToken.options);
};

// Backend validation errors look like [{ path: "email", message: "..." }]
const toFieldErrors = (error: unknown): IActionState["errors"] => {
    if (!Array.isArray(error)) return [];
    return error
        .filter((item) => item && typeof item.path === "string" && typeof item.message === "string")
        .map((item) => ({ field: item.path as string, message: item.message as string }));
};

// Only follow same-site paths the user's role is allowed to see
const resolveRedirect = (redirectTo: string | null, role: PersonRole) => {
    if (
        redirectTo &&
        redirectTo.startsWith("/") &&
        !redirectTo.startsWith("//") &&
        isValidRedirectForRole(redirectTo, role)
    ) {
        return redirectTo;
    }
    return getDefaultDashboardRoute(role);
};

// ---------- actions ----------

export async function loginUser(
    _prevState: IActionState,
    formData: FormData
): Promise<IActionState> {
    const values = { email: String(formData.get("email") ?? "") };
    const redirectTo = formData.get("redirect")?.toString() || null;

    const validated = zodValidator(
        { email: formData.get("email"), password: formData.get("password") },
        loginZodSchema
    );
    if (!validated.success) {
        return { success: false, errors: validated.errors, values };
    }

    let role: PersonRole;
    try {
        const response = await serverFetch.post("/auth/login", {
            body: JSON.stringify(validated.data),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Login failed",
                errors: toFieldErrors(result.error),
                values,
            };
        }

        await storeTokensFromResponse(response);
        role = result.data.role;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Could not reach the server. Please try again.",
            errors: [],
            values,
        };
    }

    redirect(resolveRedirect(redirectTo, role));
}

export async function registerUser(
    _prevState: IActionState,
    formData: FormData
): Promise<IActionState> {
    const values = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
    };

    const validated = zodValidator(
        {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        },
        registerZodSchema
    );
    if (!validated.success) {
        return { success: false, errors: validated.errors, values };
    }

    let role: PersonRole;
    try {
        const response = await serverFetch.post("/user/signup", {
            body: JSON.stringify(validated.data),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Sign up failed",
                errors: toFieldErrors(result.error),
                values,
            };
        }

        // The backend logs the new student in, so keep its cookies
        await storeTokensFromResponse(response);
        role = result.data.role;
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Could not reach the server. Please try again.",
            errors: [],
            values,
        };
    }

    redirect(getDefaultDashboardRoute(role));
}

export async function logoutUser() {
    try {
        await serverFetch.post("/auth/logout");
    } catch (error) {
        console.error(error);
    }
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    redirect("/login");
}

// Current user for layouts/navbar. Returns null when logged out.
export async function getUserInfo(): Promise<IUser | null> {
    try {
        // No cookie means logged out, so skip the network call
        if (!(await getCookie("accessToken"))) return null;

        const response = await serverFetch.get("/auth/me");
        if (!response.ok) return null;

        const result = await response.json();
        return result.success ? (result.data as IUser) : null;
    } catch {
        return null;
    }
}

export async function getNewAccessToken() {
    try {
        const accessToken = await getCookie("accessToken");
        const refreshToken = await getCookie("refreshToken");

        // Case 1: both tokens missing, user is logged out
        if (!accessToken && !refreshToken) {
            return { tokenRefreshed: false };
        }

        // Case 2: access token exists and is still valid
        if (accessToken) {
            const verifiedToken = await verifyAccessToken(accessToken);
            if (verifiedToken.success) {
                return { tokenRefreshed: false };
            }
        }

        // Case 3: access token invalid/expired and no refresh token
        if (!refreshToken) {
            return { tokenRefreshed: false };
        }

        // Case 4: refresh. serverFetch skips getNewAccessToken for this endpoint.
        const response = await serverFetch.post("/auth/refresh-token", {
            headers: { Cookie: `refreshToken=${refreshToken}` },
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            if (response.status === 401) {
                await deleteCookie("accessToken");
                await deleteCookie("refreshToken");
            }
            throw new Error(result.message || "Token refresh failed");
        }

        await storeTokensFromResponse(response);

        return {
            tokenRefreshed: true,
            success: true,
            message: "Token refreshed successfully",
        };
    } catch (error: unknown) {
        return {
            tokenRefreshed: false,
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}
