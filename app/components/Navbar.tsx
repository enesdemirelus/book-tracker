import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarFallback className="text-xl">📚</AvatarFallback>
        </Avatar>
        <Link href="/" className="font-semibold text-lg">
          BookTracker
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/settings">Settings</Link>
        <Link href="/about">About</Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
