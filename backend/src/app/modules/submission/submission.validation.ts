import { z } from "zod";
import { normalizeGithubRepoUrl, normalizeLiveUrl } from "../../utils/normalizeUrl";

const createSubmission = z.object({
    projectName: z
        .string({ error: "Project name is required!" })
        .trim()
        .min(3, { error: "Project name must be at least 3 characters!" })
        .max(100, { error: "Project name must be at most 100 characters!" }),

    repoUrl: z
        .string({ error: "Repository URL is required!" })
        .trim()
        .transform((value, ctx) => {
            const normalized = normalizeGithubRepoUrl(value);
            if (!normalized) {
                ctx.addIssue({
                    code: "custom",
                    message: "Enter a valid GitHub repository URL, e.g. https://github.com/username/repo",
                });
                return z.NEVER;
            }
            return normalized;
        }),

    liveUrl: z
        .string({ error: "Live link is required!" })
        .trim()
        .transform((value, ctx) => {
            const normalized = normalizeLiveUrl(value);
            if (!normalized) {
                ctx.addIssue({
                    code: "custom",
                    message: "Enter a valid public http(s) URL (localhost is not allowed)",
                });
                return z.NEVER;
            }
            return normalized;
        }),

    description: z
        .string({ error: "Description is required!" })
        .trim()
        .min(20, { error: "Description must be at least 20 characters!" })
        .max(1000, { error: "Description must be at most 1000 characters!" }),
});

export const SubmissionValidation = {
    createSubmission,
};
