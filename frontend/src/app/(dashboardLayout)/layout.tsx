import DashboardHeaderLoader from "@/components/shared/DashboardHeaderLoader";
import { DashboardHeaderSkeleton } from "@/components/shared/Skeletons";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-muted/30">
            <Suspense fallback={<DashboardHeaderSkeleton />}>
                <DashboardHeaderLoader />
            </Suspense>
            <main className="mx-auto w-full max-w-6xl p-4 md:p-6">{children}</main>
        </div>
    );
}
