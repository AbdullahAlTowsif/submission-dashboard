export interface IMeta {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
}

export interface IApiResponse<T> {
    success: boolean;
    message: string;
    meta?: IMeta | null;
    data: T;
}

// State returned by form server actions (works with getInputFieldError)
export interface IActionState {
    success: boolean;
    message?: string;
    errors: { field: string; message: string }[];
    values?: Record<string, string>; // lets the form keep what the user typed
}
