import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { getBookStats } from "@/app/actions/books";
import { HomeBookSections } from "./home-books";

export default async function HomePage() {
  const stats = await getBookStats();

  const goalProgress =
    stats.readingGoal && stats.readingGoal > 0
      ? Math.min(Math.round((stats.thisYear / stats.readingGoal) * 100), 100)
      : null;

  const totalBooks = stats.reading + stats.completed + stats.wantToRead;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.reading > 0
                ? `${stats.reading} book${stats.reading !== 1 ? "s" : ""} in progress`
                : "No books in progress"}
              {stats.completed > 0 && ` · ${stats.completed} completed`}
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Reading", value: stats.reading.toString() },
            { label: "Completed", value: stats.completed.toString() },
            { label: "Want to read", value: stats.wantToRead.toString() },
            { label: "This year", value: stats.thisYear.toString() },
          ].map(({ label, value }) => (
            <Card key={label} className="gap-0 py-0">
              <CardContent className="p-4">
                <p className="text-2xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalBooks > 0 ? (
          <HomeBookSections
            currentlyReading={JSON.parse(JSON.stringify(stats.currentlyReading))}
            recentlyFinished={JSON.parse(JSON.stringify(stats.recentlyFinished))}
          />
        ) : (
          <Card className="gap-0 py-0">
            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <BookOpen className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">Your library is empty</p>
              <p className="text-xs mt-1">
                Search and add books to start tracking your reading
              </p>
            </CardContent>
          </Card>
        )}

        {goalProgress != null && (
          <Card className="gap-0 py-0">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium">2026 Reading Goal</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.thisYear} of {stats.readingGoal} books
                  </p>
                </div>
                <p className="text-sm font-medium tabular-nums">
                  {goalProgress}%
                </p>
              </div>
              <Progress value={goalProgress} className="h-1.5" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
