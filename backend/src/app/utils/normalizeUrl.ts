const GITHUB_OWNER = /^[a-z\d](?:[a-z\d-]{0,38})$/i;
const GITHUB_REPO = /^[\w.-]{1,100}$/;

// Returns "https://github.com/owner/repo" (lowercase) or null if invalid
export const normalizeGithubRepoUrl = (input: string): string | null => {
    let url: URL;
    try {
        url = new URL(input.trim());
    } catch {
        return null;
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.hostname.toLowerCase().replace(/^www\./, "") !== "github.com") return null;

    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length !== 2) return null; // exactly owner/repo

    const owner = segments[0]!; // safe because of length check
    const repo = segments[1]!.replace(/\.git$/i, "");

    if (!GITHUB_OWNER.test(owner)) return null;
    if (!GITHUB_REPO.test(repo) || repo === "." || repo === "..") return null;

    return `https://github.com/${owner}/${repo}`.toLowerCase();
};

// Returns a clean http(s) URL or null. Rejects localhost, private IPs and embedded credentials.
export const normalizeLiveUrl = (input: string): string | null => {
    let url: URL;
    try {
        url = new URL(input.trim());
    } catch {
        return null;
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.username || url.password) return null;

    const host = url.hostname.toLowerCase();
    if (host === "localhost" || !host.includes(".")) return null;
    if (/^(0\.|10\.|127\.|169\.254\.|192\.168\.)/.test(host)) return null;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return null;

    url.hash = "";
    return url.toString();
};
