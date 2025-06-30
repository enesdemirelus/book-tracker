"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const nextTheme = resolvedTheme === "light" ? "dark" : "light";

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">
          Welcome to Enes's Book Tracker Website!
        </h1>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className="transition-transform transform hover:scale-105 active:scale-95"
          >
            Example Button!
          </Button>
          <Button
            variant="secondary"
            className="transition-transform transform hover:scale-105 active:scale-95"
            onClick={() => setTheme(nextTheme)}
          >
            Change Light-Dark Mode
          </Button>
        </div>
      </div>
    </div>
  );
}
