import { z } from "zod";
import { SubmissionStatus } from "../../../generated/prisma/enums";
import { SUBMISSION_SORT_FIELDS } from "./mentor.constant";

const listSubmissions = z.object({
    query: z.object({
        // Pagination: left loose, paginationHelper clamps these
        page: z.string().optional(),
        limit: z.string().optional(),

        // Sorting: strictly whitelisted
        sortBy: z
            .enum(SUBMISSION_SORT_FIELDS, {
                error: `sortBy must be one of: ${SUBMISSION_SORT_FIELDS.join(", ")}`,
            })
            .optional(),
        sortOrder: z.enum(["asc", "desc"], { error: "sortOrder must be asc or desc" }).optional(),

        // Filters
        status: z
            .enum([SubmissionStatus.PENDING, SubmissionStatus.APPROVED, SubmissionStatus.REJECTED], {
                error: "status must be PENDING, APPROVED or REJECTED",
            })
            .optional(),
        search: z.string().trim().max(100).optional(),
    }),
});

const reviewSubmission = z.object({
    params: z.object({
        id: z.string().min(1, { error: "Submission id is required!" }),
    }),
    body: z.object({
        status: z.enum([SubmissionStatus.APPROVED, SubmissionStatus.REJECTED], {
            error: "Status must be APPROVED or REJECTED",
        }),
        comment: z.string().trim().max(500, { error: "Comment must be at most 500 characters!" }).optional(),
    }),
});

export const MentorValidation = {
    listSubmissions,
    reviewSubmission,
};
