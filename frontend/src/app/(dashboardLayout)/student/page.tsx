import MySubmissionsList from "@/components/modules/Student/MySubmissionsList";
import SubmissionForm from "@/components/modules/Student/SubmissionForm";

export default function StudentPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">My Projects</h1>
                <p className="text-sm text-muted-foreground">
                    Submit a project for review and track its status.
                </p>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-5">
                <div className="lg:sticky lg:top-6 lg:col-span-2">
                    <SubmissionForm />
                </div>

                <section className="space-y-4 lg:col-span-3">
                    <h2 className="text-lg font-semibold">Your submissions</h2>
                    <MySubmissionsList />
                </section>
            </div>
        </div>
    );
}
