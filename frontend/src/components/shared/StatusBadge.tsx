import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SubmissionStatus } from "@/types/enum.interface";
import { CircleCheck, CircleX, Clock, type LucideIcon } from "lucide-react";

const STATUS_CONFIG: Record<
    SubmissionStatus,
    { label: string; icon: LucideIcon; className: string }
> = {
    PENDING: {
        label: "Pending",
        icon: Clock,
        className:
            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300",
    },
    APPROVED: {
        label: "Approved",
        icon: CircleCheck,
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
    },
    REJECTED: {
        label: "Rejected",
        icon: CircleX,
        className:
            "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300",
    },
};

export default function StatusBadge({ status }: { status: SubmissionStatus }) {
    const { label, icon: Icon, className } = STATUS_CONFIG[status];

    return (
        <Badge variant="outline" className={cn("gap-1", className)}>
            <Icon className="size-3.5" />
            {label}
        </Badge>
    );
}
