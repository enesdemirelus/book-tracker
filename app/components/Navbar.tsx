import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback className="text-xl">📚</AvatarFallback>
        </Avatar>
        <Link href="/home" className="font-semibold text-lg">
          BookTracker
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/home"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            href="/settings"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-1.5">
          <div className="h-8 w-8 rounded-full border flex items-center justify-center">
            <UserButton />
          </div>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
