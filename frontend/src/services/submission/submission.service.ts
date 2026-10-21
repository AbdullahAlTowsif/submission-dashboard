"use server";

import { toFieldErrors } from "@/lib/action-helpers";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import type { IActionState } from "@/types/api.interface";
import { ISubmission } from "@/types/submission.inerface";
import { createSubmissionZodSchema } from "@/zod/submission.validation";

export async function createSubmission(
    _prevState: IActionState,
    formData: FormData
): Promise<IActionState> {
    // Returned on failure so the form keeps what the user typed
    const values = {
        projectName: String(formData.get("projectName") ?? ""),
        repoUrl: String(formData.get("repoUrl") ?? ""),
        liveUrl: String(formData.get("liveUrl") ?? ""),
        description: String(formData.get("description") ?? ""),
    };

    const validated = zodValidator(
        {
            projectName: formData.get("projectName"),
            repoUrl: formData.get("repoUrl"),
            liveUrl: formData.get("liveUrl"),
            description: formData.get("description"),
        },
        createSubmissionZodSchema
    );
    if (!validated.success) {
        return { success: false, errors: validated.errors, values };
    }

    try {
        const response = await serverFetch.post("/submission", {
            body: JSON.stringify(validated.data),
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            // Duplicate: show the message under the repository field
            if (response.status === 409) {
                return {
                    success: false,
                    errors: [{ field: "repoUrl", message: result.message }],
                    values,
                };
            }
            // 429 (rate limit), 400 (server-side validation), and so on
            return {
                success: false,
                message: result.message || "Could not submit your project",
                errors: toFieldErrors(result.error),
                values,
            };
        }

        return { success: true, message: "Project submitted successfully", errors: [] };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Could not reach the server. Please try again.",
            errors: [],
            values,
        };
    }
}

// Used as the TanStack Query fetcher. Returns a result object instead of throwing,
// because error messages thrown from server actions are hidden in production.
export async function getMySubmissions(): Promise<{
    success: boolean;
    message: string;
    data: ISubmission[];
}> {
    try {
        const response = await serverFetch.get("/submission/mine");
        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Could not load your submissions",
                data: [],
            };
        }

        return { success: true, message: result.message, data: result.data as ISubmission[] };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Could not reach the server.", data: [] };
    }
}
