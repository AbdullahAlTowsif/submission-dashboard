import { SubmissionStatus } from "../../../generated/prisma/enums";
import { submissionSelect } from "../submission/submission.interface";

export interface IListSubmissionsQuery {
    page: number;
    limit: number;
    status?: SubmissionStatus;
    search?: string;
}

export interface ISubmissionFilters {
    status?: SubmissionStatus;
    search?: string;
}

export interface IReviewPayload {
    status: Extract<SubmissionStatus, "APPROVED" | "REJECTED">;
    comment?: string;
}

export const mentorSubmissionSelect = {
    ...submissionSelect,
    student: { select: { id: true, name: true, email: true } },
    feedbacks: {
        orderBy: { createdAt: "desc" as const },
        select: { id: true, comment: true, createdAt: true },
    },
} as const;
