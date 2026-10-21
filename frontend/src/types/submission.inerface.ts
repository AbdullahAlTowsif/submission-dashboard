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
