"use client";

import { SubmissionListSkeleton } from "@/components/shared/Skeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/query-keys";
import { getMySubmissions } from "@/services/submission/submission.service";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import SubmissionCard from "./SubmissionCard";

export default function MySubmissionsList() {
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: QUERY_KEYS.mySubmissions,
        queryFn: async () => {
            const result = await getMySubmissions();
            if (!result.success) throw new Error(result.message);
            return result.data;
        },
    });

    if (isLoading) {
        return <SubmissionListSkeleton count={3} />;
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertDescription className="flex items-center justify-between gap-4">
                    <span>{error.message}</span>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? "Retrying..." : "Retry"}
                    </Button>
                </AlertDescription>
            </Alert>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
                    <Inbox className="size-10 text-muted-foreground" />
                    <p className="font-medium">No submissions yet</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Submit your first project using the form and it will show up here.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
            ))}
        </div>
    );
}
