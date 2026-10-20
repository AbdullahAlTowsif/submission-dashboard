export interface ICreateSubmissionPayload {
    projectName: string;
    repoUrl: string;
    liveUrl: string;
    description: string;
}

export const submissionSelect = {
    id: true,
    projectName: true,
    repoUrl: true,
    liveUrl: true,
    description: true,
    status: true,
    createdAt: true,
    reviewedAt: true,
} as const;
