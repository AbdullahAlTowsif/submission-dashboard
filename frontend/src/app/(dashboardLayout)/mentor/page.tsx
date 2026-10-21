import MentorDashboard from "@/components/modules/Mentor/MentorDashboard";
import { StatsCardsSkeleton, TableSkeleton } from "@/components/shared/Skeletons";
import { Suspense } from "react";

export default function MentorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Review Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Review submitted projects, approve or reject them, and leave feedback.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="space-y-6">
                        <StatsCardsSkeleton />
                        <TableSkeleton />
                    </div>
                }
            >
                <MentorDashboard />
            </Suspense>
        </div>
    );
}
