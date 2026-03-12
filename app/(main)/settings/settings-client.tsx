"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Target, User } from "lucide-react";
import { updateReadingGoal } from "@/app/actions/settings";
import { toast } from "sonner";

export function SettingsClient({
  email,
  readingGoal,
}: {
  email: string;
  readingGoal: number | null;
}) {
  const [goal, setGoal] = useState(readingGoal?.toString() ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSaveGoal() {
    const value = goal.trim() === "" ? null : parseInt(goal);
    if (value !== null && (isNaN(value) || value < 0)) {
      toast.error("Enter a valid number");
      return;
    }

    startTransition(async () => {
      try {
        await updateReadingGoal(value);
        toast.success("Reading goal updated");
      } catch {
        toast.error("Failed to update goal");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and reading preferences
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Account</CardTitle>
          </div>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <p className="text-sm font-medium">{email || "No email set"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">2026 Reading Goal</CardTitle>
          </div>
          <CardDescription>
            Set how many books you want to read this year
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="goal">Number of books</Label>
            <div className="flex gap-2">
              <Input
                id="goal"
                type="number"
                placeholder="e.g. 24"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                min={0}
                className="max-w-32"
              />
              <Button
                onClick={handleSaveGoal}
                disabled={isPending}
                size="sm"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty to remove your reading goal from the dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
