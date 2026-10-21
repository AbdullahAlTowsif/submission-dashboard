"use server";

import { serverFetch } from "@/lib/server-fetch";
import type { IMeta } from "@/types/api.interface";
import { IMentorListParams, IMentorSubmission, IStats } from "@/types/submission.inerface";

export async function getMentorStats(): Promise<{
    success: boolean;
    message: string;
    data: IStats | null;
}> {
    try {
        const response = await serverFetch.get("/mentor/stats");
        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Could not load statistics",
                data: null,
            };
        }
        return { success: true, message: result.message, data: result.data as IStats };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Could not reach the server.", data: null };
    }
}

export async function getMentorSubmissions(params: IMentorListParams): Promise<{
    success: boolean;
    message: string;
    data: IMentorSubmission[];
    meta: IMeta | null;
}> {
    try {
        const query = new URLSearchParams({
            page: String(params.page),
            limit: String(params.limit),
        });
        if (params.status) query.set("status", params.status);
        if (params.search?.trim()) query.set("search", params.search.trim());

        const response = await serverFetch.get(`/mentor/submissions?${query.toString()}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Could not load submissions",
                data: [],
                meta: null,
            };
        }
        return {
            success: true,
            message: result.message,
            data: result.data as IMentorSubmission[],
            meta: (result.meta as IMeta) ?? null,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Could not reach the server.", data: [], meta: null };
    }
}

export async function reviewSubmission(input: {
    id: string;
    status: "APPROVED" | "REJECTED";
    comment?: string;
}): Promise<{ success: boolean; message: string }> {
    try {
        const comment = input.comment?.trim();

        const response = await serverFetch.patch(
            `/mentor/submissions/${encodeURIComponent(input.id)}/status`,
            {
                body: JSON.stringify({
                    status: input.status,
                    ...(comment ? { comment } : {}),
                }),
            }
        );
        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Could not review this submission",
            };
        }
        return { success: true, message: result.message };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Could not reach the server." };
    }
}
