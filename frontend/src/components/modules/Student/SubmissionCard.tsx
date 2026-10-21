"use client";

import StatusBadge from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/date-utils";
import { ISubmission } from "@/types/submission.inerface";
import { ExternalLink, MessageSquare } from "lucide-react";

export default function SubmissionCard({ submission }: { submission: ISubmission }) {
    const feedbacks = submission.feedbacks ?? [];

    return (
        <Card>
            <CardContent className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold leading-tight">{submission.projectName}</h3>
                    <StatusBadge status={submission.status} />
                </div>

                <p className="whitespace-pre-line text-sm text-muted-foreground">
                    {submission.description}
                </p>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <a
                        href={submission.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
                    >
                        Repository <ExternalLink className="size-3.5" />
                    </a>
                    <a
                        href={submission.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
                    >
                        Live site <ExternalLink className="size-3.5" />
                    </a>
                </div>

                {feedbacks.length > 0 && (
                    <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
                        <p className="flex items-center gap-1.5 text-sm font-medium">
                            <MessageSquare className="size-4" />
                            Mentor feedback
                        </p>
                        {feedbacks.map((feedback) => (
                            <div key={feedback.id} className="text-sm">
                                <p>{feedback.comment}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDateTime(feedback.createdAt)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(submission.createdAt)}
                    {submission.reviewedAt && <> · Reviewed {formatDate(submission.reviewedAt)}</>}
                </p>
            </CardContent>
        </Card>
    );
}
