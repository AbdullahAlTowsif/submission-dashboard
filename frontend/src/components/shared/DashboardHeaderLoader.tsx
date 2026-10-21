import { connection } from "next/server";
import DashboardHeader from "@/components/shared/DashboardHeader";
import { Button } from "@/components/ui/button";
import { getUserInfo, logoutUser } from "@/services/auth/auth.service";

export default async function DashboardHeaderLoader() {
    await connection(); // tells Next.js: run this at request time, not during prerender
    const user = await getUserInfo();

    // The proxy thinks we're logged in but the account can't be loaded (backend down,
    // user deleted). Don't redirect to /login: the proxy would send us straight back.
    if (!user) {
        return (
            <header className="border-b bg-background">
                <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                    <span className="text-sm text-muted-foreground">
                        We could not load your account.
                    </span>
                    <form action={logoutUser}>
                        <Button type="submit" variant="outline" size="sm">
                            Log out
                        </Button>
                    </form>
                </div>
            </header>
        );
    }

    return <DashboardHeader user={user} />;
}
