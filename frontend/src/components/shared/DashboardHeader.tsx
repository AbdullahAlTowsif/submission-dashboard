import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { logoutUser } from "@/services/auth/auth.service";
import type { IUser } from "@/types/user.interface";
import Link from "next/link";

export default function DashboardHeader({ user }: { user: IUser }) {
    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="font-semibold">
                        Project Review
                    </Link>
                    <nav className="flex items-center gap-4 text-sm">
                        {getNavItemsByRole(user.role).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <span className="hidden text-sm sm:inline">{user.name}</span>
                    <Badge variant="secondary">{user.role}</Badge>
                    <form action={logoutUser}>
                        <Button type="submit" variant="outline" size="sm">
                            Log out
                        </Button>
                    </form>
                </div>
            </div>
        </header>
    );
}
