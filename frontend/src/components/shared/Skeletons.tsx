import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Fallbacks must be deterministic, so no Math.random(): cycle through fixed widths
const WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-2/5", "w-3/5"];
const widthAt = (index: number) => WIDTHS[index % WIDTHS.length];

/** The base building block: one shimmering rectangle. */
export function Bone({ className }: { className?: string }) {
    return <div aria-hidden="true" className={cn("skeleton", className)} />;
}

function Root({
    children,
    className,
    label = "Loading",
}: {
    children: React.ReactNode;
    className?: string;
    label?: string;
}) {
    return (
        <div role="status" aria-busy="true" aria-live="polite" className={className}>
            <span className="sr-only">{label}...</span>
            {children}
        </div>
    );
}

/** Login / Sign up buttons area of the Navbar. */
export function NavbarActionsSkeleton() {
    return (
        <Root label="Loading account" className="flex items-center gap-2">
            <Bone className="h-9 w-16" />
            <Bone className="h-9 w-20" />
        </Root>
    );
}

/** Full dashboard header: brand stays real text, the rest shimmers. */
export function DashboardHeaderSkeleton() {
    return (
        <header className="border-b bg-background">
            <Root
                label="Loading navigation"
                className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4"
            >
                <div className="flex items-center gap-6">
                    <span className="font-semibold">Project Review</span>
                    <Bone className="h-4 w-28" />
                </div>
                <div className="flex items-center gap-3">
                    <Bone className="hidden h-4 w-24 sm:block" />
                    <Bone className="h-6 w-16 rounded-full" />
                    <Bone className="h-8 w-20" />
                </div>
            </Root>
        </header>
    );
}

/** Auth card (login / signup): title, description, N fields, button. */
export function FormCardSkeleton({ fields = 2 }: { fields?: number }) {
    return (
        <Root label="Loading form" className="w-full max-w-md">
            <Card>
                <CardHeader className="space-y-2">
                    <Bone className="h-6 w-40" />
                    <Bone className="h-4 w-64 max-w-full" />
                </CardHeader>
                <CardContent className="space-y-5">
                    {Array.from({ length: fields }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <Bone className="h-4 w-16" />
                            <Bone className="h-9 w-full" />
                        </div>
                    ))}
                    <Bone className="h-9 w-full" />
                    <Bone className="mx-auto h-4 w-56 max-w-full" />
                </CardContent>
            </Card>
        </Root>
    );
}

/** Page title + subtitle + primary action. */
export function PageHeaderSkeleton() {
    return (
        <Root label="Loading page" className="mb-6 flex items-center justify-between gap-4">
            <div className="space-y-2">
                <Bone className="h-8 w-56" />
                <Bone className="h-4 w-72 max-w-full" />
            </div>
            <Bone className="hidden h-9 w-32 sm:block" />
        </Root>
    );
}

/** Row of statistic cards (Pending / Approved / Rejected / Total). */
export function StatsCardsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <Root label="Loading statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="space-y-3">
                        <Bone className="h-4 w-24" />
                        <Bone className="h-9 w-16" />
                        <Bone className="h-3 w-32" />
                    </CardContent>
                </Card>
            ))}
        </Root>
    );
}

/** Data table: filter toolbar, header row, body rows, pagination footer. */
export function TableSkeleton({
    rows = 6,
    columns = 5,
    showToolbar = true,
}: {
    rows?: number;
    columns?: number;
    showToolbar?: boolean;
}) {
    return (
        <Root label="Loading table">
            <Card>
                {showToolbar && (
                    <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
                        <div className="flex gap-2">
                            <Bone className="h-9 w-16" />
                            <Bone className="h-9 w-20" />
                            <Bone className="h-9 w-20" />
                        </div>
                        <Bone className="h-9 w-56 max-w-full" />
                    </CardHeader>
                )}
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {Array.from({ length: columns }).map((_, c) => (
                                    <TableHead key={c}>
                                        <Bone className="h-4 w-20" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: rows }).map((_, r) => (
                                <TableRow key={r}>
                                    {Array.from({ length: columns }).map((_, c) => (
                                        <TableCell key={c}>
                                            <Bone className={cn("h-4", widthAt(r + c))} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="mt-4 flex items-center justify-between">
                        <Bone className="h-4 w-32" />
                        <div className="flex gap-2">
                            <Bone className="h-8 w-20" />
                            <Bone className="h-8 w-20" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Root>
    );
}

/** "My submissions" list: cards with title, status badge, description, links. */
export function SubmissionListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <Root label="Loading submissions" className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                            <Bone className="h-5 w-48 max-w-[60%]" />
                            <Bone className="h-6 w-20 rounded-full" />
                        </div>
                        <Bone className="h-4 w-full" />
                        <Bone className={cn("h-4", widthAt(i + 2))} />
                        <div className="flex gap-4 pt-1">
                            <Bone className="h-4 w-24" />
                            <Bone className="h-4 w-24" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </Root>
    );
}

/** Generic dashboard page fallback (used by loading.tsx). */
export function PageSkeleton() {
    return (
        <div>
            <PageHeaderSkeleton />
            <TableSkeleton />
        </div>
    );
}
