import type { PersonRole } from "./auth-utils";

export interface INavItem {
    title: string;
    href: string;
}

export const navItemsByRole: Record<PersonRole, INavItem[]> = {
    STUDENT: [{ title: "My Submissions", href: "/student" }],
    MENTOR: [{ title: "Review Dashboard", href: "/mentor" }],
};

export const getNavItemsByRole = (role: PersonRole): INavItem[] => navItemsByRole[role];
