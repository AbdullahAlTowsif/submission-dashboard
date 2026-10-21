"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getInputFieldError } from "@/lib/getInputFieldError";
import { QUERY_KEYS } from "@/lib/query-keys";
import { createSubmission } from "@/services/submission/submission.service";
import type { IActionState } from "@/types/api.interface";
import { useQueryClient } from "@tanstack/react-query";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState: IActionState = { success: false, errors: [] };

export default function SubmissionForm() {
    const queryClient = useQueryClient();
    const [state, formAction, isPending] = useActionState(createSubmission, initialState);

    // On success: toast + refresh "My submissions".
    // The form clears itself because no `values` come back (defaultValue is empty).
    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Project submitted successfully");
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mySubmissions });
        }
    }, [state, queryClient]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit a project</CardTitle>
                <CardDescription>
                    A mentor will review it and leave feedback. You can submit each repository once.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4" noValidate>
                    {state.message && !state.success && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="projectName">Project name</Label>
                        <Input
                            id="projectName"
                            name="projectName"
                            placeholder="My awesome project"
                            defaultValue={state.values?.projectName}
                            aria-invalid={Boolean(getInputFieldError("projectName", state))}
                        />
                        <InputFieldError field="projectName" state={state} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="repoUrl">Repository URL</Label>
                        <Input
                            id="repoUrl"
                            name="repoUrl"
                            type="url"
                            inputMode="url"
                            placeholder="https://github.com/username/repo"
                            defaultValue={state.values?.repoUrl}
                            aria-invalid={Boolean(getInputFieldError("repoUrl", state))}
                        />
                        <InputFieldError field="repoUrl" state={state} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="liveUrl">Live link</Label>
                        <Input
                            id="liveUrl"
                            name="liveUrl"
                            type="url"
                            inputMode="url"
                            placeholder="https://my-project.vercel.app"
                            defaultValue={state.values?.liveUrl}
                            aria-invalid={Boolean(getInputFieldError("liveUrl", state))}
                        />
                        <InputFieldError field="liveUrl" state={state} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            rows={5}
                            placeholder="What does it do, and what did you build it with?"
                            defaultValue={state.values?.description}
                            aria-invalid={Boolean(getInputFieldError("description", state))}
                        />
                        <p className="text-xs text-muted-foreground">20 to 500 characters.</p>
                        <InputFieldError field="description" state={state} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Submitting..." : "Submit project"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
