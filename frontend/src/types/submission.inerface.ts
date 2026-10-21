import type { SubmissionStatus } from "./enum.interface";

export interface IFeedback {
    id: string;
    comment: string;
    createdAt: string;
}

export interface ISubmission {
    id: string;
    projectName: string;
    repoUrl: string;
    liveUrl: string;
    description: string;
    status: SubmissionStatus;
    createdAt: string;
    reviewedAt: string | null;
    feedbacks?: IFeedback[];
}


export interface IMentorSubmission extends ISubmission {
    student: { id: string; name: string; email: string };
}

export interface IStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

export interface IMentorListParams {
    page: number;
    limit: number;
    status?: SubmissionStatus;
    search?: string;
}
