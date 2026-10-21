import type { IActionState } from "@/types/api.interface";

// Backend validation errors look like [{ path: "email", message: "..." }]
export const toFieldErrors = (error: unknown): IActionState["errors"] => {
    if (!Array.isArray(error)) return [];
    return error
        .filter((item) => item && typeof item.path === "string" && typeof item.message === "string")
        .map((item) => ({ field: item.path as string, message: item.message as string }));
};
