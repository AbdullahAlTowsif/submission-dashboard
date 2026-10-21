"use client";

import InputFieldError from "@/components/shared/InputFieldError";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInputFieldError } from "@/lib/getInputFieldError";
import { registerUser } from "@/services/auth/auth.service";
import type { IActionState } from "@/types/api.interface";
import Link from "next/link";
import { useActionState } from "react";

const initialState: IActionState = { success: false, errors: [] };

export default function SignupForm() {
    const [state, formAction, isPending] = useActionState(registerUser, initialState);

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>Sign up as a student to submit your projects.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4" noValidate>
                    {state.message && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            autoComplete="name"
                            placeholder="Your full name"
                            defaultValue={state.values?.name}
                            aria-invalid={Boolean(getInputFieldError("name", state))}
                        />
                        <InputFieldError field="name" state={state} />
                    </div>

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
                            autoComplete="new-password"
                            aria-invalid={Boolean(getInputFieldError("password", state))}
                        />
                        <p className="text-xs text-muted-foreground">At least 6 characters.</p>
                        <InputFieldError field="password" state={state} />
                    </div>

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? "Creating account..." : "Sign up"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-foreground underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
