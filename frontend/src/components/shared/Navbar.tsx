import { Button } from "@/components/ui/button";
import { NavbarActionsSkeleton } from "@/components/shared/Skeletons";
import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getUserInfo } from "@/services/auth/auth.service";
import Link from "next/link";
import { Suspense } from "react";

async function NavbarActions() {
    const user = await getUserInfo();

    if (user) {
        return (
            <Link href={getDefaultDashboardRoute(user.role)}>
                <Button>
                    Dashboard
                </Button>
            </Link>
        );
    }

    return (
        <>
            <Link href="/login">
                <Button variant="ghost">
                    Log in
                </Button>
            </Link>
            <Link href="/signup">
                <Button>
                    Sign up
                </Button>
            </Link>
        </>
    );
}

export default function Navbar() {
    return (
        <header className="border-b bg-background">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                <Link href="/" className="font-semibold">
                    Project Review
                </Link>

                <nav className="flex items-center gap-2">
                    <Suspense fallback={<NavbarActionsSkeleton />}>
                        <NavbarActions />
                    </Suspense>
                </nav>
            </div>
        </header>
    );
}
