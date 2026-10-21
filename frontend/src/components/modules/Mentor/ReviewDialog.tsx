"use client";

import StatusBadge from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatDateTime } from "@/lib/date-utils";
import { QUERY_KEYS } from "@/lib/query-keys";
import { reviewSubmission } from "@/services/mentor/mentor.service";
import { IMentorSubmission } from "@/types/submission.inerface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MAX_COMMENT = 500;
type Decision = "APPROVED" | "REJECTED";

function ReviewContent({
    submission,
    onClose,
}: {
    submission: IMentorSubmission;
    onClose: () => void;
}) {
    const queryClient = useQueryClient();
    const [comment, setComment] = useState("");
    const isPending = submission.status === "PENDING";
    const feedbacks = submission.feedbacks ?? [];

    const mutation = useMutation({
        mutationFn: async (status: Decision) => {
            const result = await reviewSubmission({ id: submission.id, status, comment });
            if (!result.success) throw new Error(result.message);
            return status;
        },
        onSuccess: (status) => {
            toast.success(status === "APPROVED" ? "Submission approved" : "Submission rejected");
            onClose();
        },
        onError: (error) => toast.error(error.message),
        // Refresh in every case, so a failed (already reviewed) attempt also updates the table
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mentorSubmissions });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mentorStats });
        },
    });

    const isApproving = mutation.isPending && mutation.variables === "APPROVED";
    const isRejecting = mutation.isPending && mutation.variables === "REJECTED";

    return (
        <>
            <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                    {submission.projectName}
                    <StatusBadge status={submission.status} />
                </DialogTitle>
                <DialogDescription>
                    Submitted by {submission.student.name} ({submission.student.email}) on{" "}
                    {formatDate(submission.createdAt)}
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <p className="whitespace-pre-line text-sm">{submission.description}</p>

                <div className="flex flex-wrap gap-3">
                    <a href={submission.repoUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                            Repository <ExternalLink />
                        </Button>
                    </a>
                    <a href={submission.liveUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">
                            Live site <ExternalLink />
                        </Button>
                    </a>
                </div>

                {isPending ? (
                    <div className="space-y-2">
                        <Label htmlFor="review-comment">Feedback for the student (optional)</Label>
                        <Textarea
                            id="review-comment"
                            rows={4}
                            maxLength={MAX_COMMENT}
                            value={comment}
                            onChange={(event) => setComment(event.target.value)}
                            placeholder="What worked well? What should be improved?"
                            disabled={mutation.isPending}
                        />
                        <p className="text-right text-xs text-muted-foreground">
                            {comment.length}/{MAX_COMMENT}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
                        <p className="flex items-center gap-1.5 text-sm font-medium">
                            <MessageSquare className="size-4" />
                            Feedback
                            {submission.reviewedAt && (
                                <span className="font-normal text-muted-foreground">
                                    · reviewed {formatDate(submission.reviewedAt)}
                                </span>
                            )}
                        </p>
                        {feedbacks.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No feedback was left for this submission.
                            </p>
                        ) : (
                            feedbacks.map((feedback) => (
                                <div key={feedback.id} className="text-sm">
                                    <p>{feedback.comment}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDateTime(feedback.createdAt)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {isPending && (
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="destructive"
                        onClick={() => mutation.mutate("REJECTED")}
                        disabled={mutation.isPending}
                    >
                        {isRejecting ? "Rejecting..." : "Reject"}
                    </Button>
                    <Button onClick={() => mutation.mutate("APPROVED")} disabled={mutation.isPending}>
                        {isApproving ? "Approving..." : "Approve"}
                    </Button>
                </DialogFooter>
            )}
        </>
    );
}

interface Props {
    submission: IMentorSubmission | null;
    onClose: () => void;
}

export default function ReviewDialog({ submission, onClose }: Props) {
    return (
        <Dialog
            open={submission !== null}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
        >
            <DialogContent className="sm:max-w-lg">
                {/* key resets the comment box whenever a different submission is opened */}
                {submission && (
                    <ReviewContent key={submission.id} submission={submission} onClose={onClose} />
                )}
            </DialogContent>
        </Dialog>
    );
}
