"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInputFieldError } from "@/lib/getInputFieldError";
import { loginUser } from "@/services/auth/auth.service";
import type { IActionState } from "@/types/api.interface";
import Link from "next/link";
import { useActionState } from "react";

const initialState: IActionState = { success: false, errors: [] };

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
    const [state, formAction, isPending] = useActionState(loginUser, initialState);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Log in to submit or review projects.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4" noValidate>
                    {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

                    {state.message && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            defaultValue={state.values?.email}
                            aria-invalid={Boolean(getInputFieldError("email", state))}
                        />
                        <InputFieldError field="email" state={state} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            aria-invalid={Boolean(getInputFieldError("password", state))}
                        />
                        <InputFieldError field="password" state={state} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Logging in..." : "Log in"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        New here?{" "}
                        <Link href="/signup" className="font-medium text-foreground underline">
                            Create a student account
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
