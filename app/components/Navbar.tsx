import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b">
      <Link href="/" className="font-semibold text-lg">
        BookTracker
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/">Home</Link>
        <Link href="/settings">Settings</Link>
        <Link href="/about">About</Link>
        <ModeToggle />
      </div>
    </nav>
  );
}

