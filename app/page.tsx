import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Book, BookOpen, Target, TrendingUp } from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/home");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Book className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              BookTracker
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Track your reading
            <br />
            <span className="text-muted-foreground">one book at a time</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Keep your personal reading log, track progress, and set yearly
            goals. Simple and focused.
          </p>
          <div className="flex gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start tracking</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
          {[
            {
              icon: BookOpen,
              title: "Track your library",
              description:
                "Add books from Open Library, organize by status, and see your full collection at a glance.",
            },
            {
              icon: TrendingUp,
              title: "Monitor progress",
              description:
                "Update your page progress as you read. See how far you've come and how much is left.",
            },
            {
              icon: Target,
              title: "Set yearly goals",
              description:
                "Challenge yourself with an annual reading goal and watch your progress grow throughout the year.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        BookTracker &middot; Built with Next.js
      </footer>
    </div>
  );
}
