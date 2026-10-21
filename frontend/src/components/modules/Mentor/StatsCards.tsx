"use client";

import { StatsCardsSkeleton } from "@/components/shared/Skeletons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QUERY_KEYS } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { getMentorStats } from "@/services/mentor/mentor.service";
import type { SubmissionStatus } from "@/types/enum.interface";
import { IStats } from "@/types/submission.inerface";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, CircleX, Clock, Layers, type LucideIcon } from "lucide-react";

const ITEMS: {
    key: keyof IStats;
    label: string;
    status?: SubmissionStatus;
    icon: LucideIcon;
    tone: string;
}[] = [
        { key: "total", label: "Total", icon: Layers, tone: "text-foreground" },
        {
            key: "pending",
            label: "Pending",
            status: "PENDING",
            icon: Clock,
            tone: "text-amber-600 dark:text-amber-400",
        },
        {
            key: "approved",
            label: "Approved",
            status: "APPROVED",
            icon: CircleCheck,
            tone: "text-emerald-600 dark:text-emerald-400",
        },
        {
            key: "rejected",
            label: "Rejected",
            status: "REJECTED",
            icon: CircleX,
            tone: "text-red-600 dark:text-red-400",
        },
    ];

interface Props {
    activeStatus?: SubmissionStatus;
    onSelect: (status?: SubmissionStatus) => void;
}

export default function StatsCards({ activeStatus, onSelect }: Props) {
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: QUERY_KEYS.mentorStats,
        queryFn: async () => {
            const result = await getMentorStats();
            if (!result.success || !result.data) throw new Error(result.message);
            return result.data;
        },
        refetchOnWindowFocus: true,
    });

    if (isLoading) return <StatsCardsSkeleton />;

    if (isError || !data) {
        return (
            <Alert variant="destructive">
                <AlertDescription className="flex items-center justify-between gap-4">
                    <span>{error?.message ?? "Could not load statistics"}</span>
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

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ITEMS.map(({ key, label, status, icon: Icon, tone }) => {
                const isActive = activeStatus === status;

                return (
                    <button
                        key={key}
                        type="button"
                        onClick={() => onSelect(status)}
                        aria-pressed={isActive}
                        className="rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <Card
                            className={cn(
                                "transition-shadow hover:shadow-md",
                                isActive && "ring-2 ring-primary"
                            )}
                        >
                            <CardContent className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">{label}</p>
                                    <p className="text-3xl font-semibold tabular-nums">
                                        {data[key]}
                                    </p>
                                </div>
                                <div className={cn("rounded-lg bg-muted p-2", tone)}>
                                    <Icon className="size-5" />
                                </div>
                            </CardContent>
                        </Card>
                    </button>
                );
            })}
        </div>
    );
}
