import { getUserBooks } from "@/app/actions/books";
import { LibraryClient } from "./library-client";

export default async function LibraryPage() {
  const books = await getUserBooks();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <LibraryClient books={JSON.parse(JSON.stringify(books))} />
      </div>
    </div>
  );
}
