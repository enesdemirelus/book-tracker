import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/home");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
      <h1 className="text-4xl font-bold tracking-tight">BookTracker</h1>
      <p className="text-muted-foreground">Track the books you read.</p>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
