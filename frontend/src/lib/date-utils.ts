export const formatDate = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(iso)
    );
