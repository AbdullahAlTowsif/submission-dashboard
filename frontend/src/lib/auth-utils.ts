export type PersonRole = "STUDENT" | "MENTOR";

export type RouteConfig = {
    exact: string[];
    patterns: RegExp[];
};

export const authRoutes = ["/login", "/signup"];

export const commonProtectedRoutes: RouteConfig = {
    exact: [],
    patterns: [],
};

export const mentorProtectedRoutes: RouteConfig = {
    patterns: [/^\/mentor/],
    exact: [],
};

export const studentProtectedRoutes: RouteConfig = {
    patterns: [/^\/student/],
    exact: [],
};

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
};

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (
    pathname: string
): "MENTOR" | "STUDENT" | "COMMON" | null => {
    if (isRouteMatches(pathname, mentorProtectedRoutes)) {
        return "MENTOR";
    }
    if (isRouteMatches(pathname, studentProtectedRoutes)) {
        return "STUDENT";
    }
    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }
    return null;
};

export const getDefaultDashboardRoute = (role: PersonRole): string => {
    if (role === "MENTOR") {
        return "/mentor";
    }
    if (role === "STUDENT") {
        return "/student";
    }
    return "/";
};

export const isValidRedirectForRole = (redirectPath: string, role: PersonRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }
    return routeOwner === role;
};
