"use client";

import type { SubmissionStatus } from "@/types/enum.interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import StatsCards from "./StatsCards";
import SubmissionFilters from "./SubmissionFilters";
import SubmissionsTable from "./SubmissionsTable";

const PAGE_SIZE = 10;
const STATUSES: SubmissionStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export default function MentorDashboard() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // The URL is the single source of truth for filters and the page number
    const statusParam = searchParams.get("status");
    const status = STATUSES.includes(statusParam as SubmissionStatus)
        ? (statusParam as SubmissionStatus)
        : undefined;
    const search = searchParams.get("search") ?? "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);

    // Bumping this remounts the filters, which resets the search box on "Clear filters"
    const [filtersKey, setFiltersKey] = useState(0);

    const updateParams = useCallback(
        (updates: Record<string, string | undefined>) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (value) params.set(key, value);
                else params.delete(key);
            });
            const query = params.toString();
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        },
        [router, pathname, searchParams]
    );

    const handleStatusChange = useCallback(
        (next?: SubmissionStatus) => updateParams({ status: next, page: undefined }),
        [updateParams]
    );

    const handleSearchChange = useCallback(
        (next: string) => updateParams({ search: next || undefined, page: undefined }),
        [updateParams]
    );

    const handlePageChange = useCallback(
        (next: number) => updateParams({ page: next > 1 ? String(next) : undefined }),
        [updateParams]
    );

    const handleClearFilters = useCallback(() => {
        setFiltersKey((key) => key + 1);
        router.replace(pathname, { scroll: false });
    }, [router, pathname]);

    return (
        <div className="space-y-6">
            <StatsCards activeStatus={status} onSelect={handleStatusChange} />

            <section className="space-y-4">
                <SubmissionFilters
                    key={filtersKey}
                    status={status}
                    search={search}
                    onStatusChange={handleStatusChange}
                    onSearchChange={handleSearchChange}
                />
                <SubmissionsTable
                    page={page}
                    limit={PAGE_SIZE}
                    status={status}
                    search={search}
                    hasFilters={Boolean(status || search)}
                    onPageChange={handlePageChange}
                    onClearFilters={handleClearFilters}
                />
            </section>
        </div>
    );
}
