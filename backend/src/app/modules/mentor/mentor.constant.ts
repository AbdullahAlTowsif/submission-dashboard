export const SUBMISSION_FILTER_FIELDS = ["status", "search"] as const;

export const SUBMISSION_SORT_FIELDS = [
    "createdAt",
    "reviewedAt",
    "projectName",
    "status",
] as const;

export const PAGINATION_FIELDS = ["page", "limit", "sortBy", "sortOrder"] as const;
