import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export default function TablePagination({
    page,
    totalPages,
    total,
    limit,
    onPageChange,
    disabled,
}: Props) {
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);
    const lastPage = Math.max(totalPages, 1);

    return (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
                Showing {from}–{to} of {total}
            </p>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page - 1)}
                    disabled={disabled || page <= 1}
                >
                    <ChevronLeft />
                    Previous
                </Button>
                <span className="text-sm tabular-nums text-muted-foreground">
                    Page {page} of {lastPage}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(page + 1)}
                    disabled={disabled || page >= lastPage}
                >
                    Next
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
}
