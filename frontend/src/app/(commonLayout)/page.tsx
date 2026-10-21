import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight">
        Submit your projects. Get mentor feedback.
      </h1>
      <p className="text-muted-foreground">
        Students submit a repository and live link. Mentors review, approve, or reject
        with feedback.
      </p>
      <div className="flex gap-3">
        <Link href="/signup">
          <Button size="lg">Get started</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline">
            Log in
          </Button>
        </Link>
      </div>
    </section>
  );
}
