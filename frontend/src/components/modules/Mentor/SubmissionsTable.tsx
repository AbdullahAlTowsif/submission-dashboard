"use client";

import { TableSkeleton } from "@/components/shared/Skeletons";
import StatusBadge from "@/components/shared/StatusBadge";
import TablePagination from "@/components/shared/TablePagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/date-utils";
import { QUERY_KEYS } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { getMentorSubmissions } from "@/services/mentor/mentor.service";
import type { SubmissionStatus } from "@/types/enum.interface";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ExternalLink, Inbox } from "lucide-react";
import { useEffect, useState } from "react";
import ReviewDialog from "./ReviewDialog";
import { IMentorSubmission } from "@/types/submission.inerface";

interface Props {
    page: number;
    limit: number;
    status?: SubmissionStatus;
    search: string;
    hasFilters: boolean;
    onPageChange: (page: number) => void;
    onClearFilters: () => void;
}

export default function SubmissionsTable({
    page,
    limit,
    status,
    search,
    hasFilters,
    onPageChange,
    onClearFilters,
}: Props) {
    const [selected, setSelected] = useState<IMentorSubmission | null>(null);

    const { data, isLoading, isError, error, refetch, isFetching, isPlaceholderData } = useQuery({
        queryKey: [...QUERY_KEYS.mentorSubmissions, { page, limit, status, search }],
        queryFn: async () => {
            const result = await getMentorSubmissions({ page, limit, status, search });
            if (!result.success) throw new Error(result.message);
            return result;
        },
        placeholderData: keepPreviousData, // keep showing the old rows while the next page loads
        refetchOnWindowFocus: true,
    });

    const rows = data?.data ?? [];
    const meta = data?.meta;
    const totalPages = meta?.totalPages ?? 1;

    // e.g. ?page=99 in the URL, or the last row of the last page was just reviewed
    useEffect(() => {
        if (!isPlaceholderData && data && rows.length === 0 && page > 1) {
            onPageChange(Math.max(1, totalPages));
        }
    }, [data, isPlaceholderData, rows.length, page, totalPages, onPageChange]);

    if (isLoading) {
        return <TableSkeleton rows={limit} columns={6} showToolbar={false} />;
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

    if (meta && meta.total === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
                    <Inbox className="size-10 text-muted-foreground" />
                    <p className="font-medium">
                        {hasFilters ? "No submissions match your filters" : "No submissions yet"}
                    </p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        {hasFilters
                            ? "Try a different status or search term."
                            : "Student submissions will appear here once they are made."}
                    </p>
                    {hasFilters && (
                        <Button variant="outline" size="sm" onClick={onClearFilters}>
                            Clear filters
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card
                aria-busy={isFetching}
                className={cn("transition-opacity", isPlaceholderData && "opacity-60")}
            >
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead className="hidden md:table-cell">Links</TableHead>
                                <TableHead className="hidden sm:table-cell">Submitted</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((submission) => {
                                const isPending = submission.status === "PENDING";

                                return (
                                    <TableRow key={submission.id}>
                                        <TableCell className="max-w-[16rem]">
                                            <p className="truncate font-medium">
                                                {submission.projectName}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {submission.description}
                                            </p>
                                        </TableCell>

                                        <TableCell>
                                            <p className="text-sm">{submission.student.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {submission.student.email}
                                            </p>
                                        </TableCell>

                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex gap-3 text-sm">
                                                <a
                                                    href={submission.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                                                >
                                                    Repo <ExternalLink className="size-3" />
                                                </a>
                                                <a
                                                    href={submission.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                                                >
                                                    Live <ExternalLink className="size-3" />
                                                </a>
                                            </div>
                                        </TableCell>

                                        <TableCell className="hidden whitespace-nowrap text-sm text-muted-foreground sm:table-cell">
                                            {formatDate(submission.createdAt)}
                                        </TableCell>

                                        <TableCell>
                                            <StatusBadge status={submission.status} />
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant={isPending ? "default" : "outline"}
                                                onClick={() => setSelected(submission)}
                                            >
                                                {isPending ? "Review" : "Details"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    <TablePagination
                        page={page}
                        totalPages={totalPages}
                        total={meta?.total ?? 0}
                        limit={limit}
                        onPageChange={onPageChange}
                        disabled={isPlaceholderData}
                    />
                </CardContent>
            </Card>

            <ReviewDialog submission={selected} onClose={() => setSelected(null)} />
        </>
    );
}
