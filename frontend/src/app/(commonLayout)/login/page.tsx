import LoginForm from "@/components/modules/Auth/LoginForm";
import { FormCardSkeleton } from "@/components/shared/Skeletons";
import { Suspense } from "react";

type LoginSearchParams = Promise<{ redirect?: string }>;

async function LoginFormLoader({ searchParams }: { searchParams: LoginSearchParams }) {
    const { redirect } = await searchParams;
    return <LoginForm redirectTo={redirect} />;
}

export default function LoginPage({ searchParams }: { searchParams: LoginSearchParams }) {
    return (
        <div className="flex flex-1 items-center justify-center p-4">
            <Suspense fallback={<FormCardSkeleton fields={2} />}>
                <LoginFormLoader searchParams={searchParams} />
            </Suspense>
        </div>
    );
}
