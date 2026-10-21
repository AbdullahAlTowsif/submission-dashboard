import { z } from "zod";

const isGithubRepoUrl = (value: string) => {
    try {
        const url = new URL(value.trim());
        if (url.protocol !== "https:" && url.protocol !== "http:") return false;
        if (url.hostname.toLowerCase().replace(/^www\./, "") !== "github.com") return false;
        return url.pathname.split("/").filter(Boolean).length === 2; // owner/repo
    } catch {
        return false;
    }
};

const isPublicHttpUrl = (value: string) => {
    try {
        const url = new URL(value.trim());
        if (url.protocol !== "https:" && url.protocol !== "http:") return false;
        if (url.username || url.password) return false;
        const host = url.hostname.toLowerCase();
        return host !== "localhost" && host.includes(".");
    } catch {
        return false;
    }
};

export const createSubmissionZodSchema = z.object({
    projectName: z
        .string({ error: "Project name is required!" })
        .trim()
        .min(3, { error: "Project name must be at least 3 characters!" })
        .max(100, { error: "Project name must be at most 100 characters!" }),

    repoUrl: z
        .string({ error: "Repository URL is required!" })
        .trim()
        .refine(isGithubRepoUrl, {
            error: "Enter a valid GitHub repository URL, e.g. https://github.com/username/repo",
        }),

    liveUrl: z
        .string({ error: "Live link is required!" })
        .trim()
        .refine(isPublicHttpUrl, {
            error: "Enter a valid public http(s) URL (localhost is not allowed)",
        }),

    description: z
        .string({ error: "Description is required!" })
        .trim()
        .min(20, { error: "Description must be at least 20 characters!" })
        .max(500, { error: "Description must be at most 500 characters!" }),
});
