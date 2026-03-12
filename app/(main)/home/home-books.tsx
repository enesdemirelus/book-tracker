"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ReadingBookCard, FinishedBookCard } from "@/app/components/BookCard";
import { BookDetailSheet } from "@/app/components/BookDetailSheet";

type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  cover_image_url: string | null;
  page_count: number | null;
  page_progress: number | null;
  readingStatus: string;
  started_at: Date | null;
  finished_at: Date | null;
};

export function HomeBookSections({
  currentlyReading,
  recentlyFinished,
}: {
  currentlyReading: Book[];
  recentlyFinished: Book[];
}) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const allBooks = [...currentlyReading, ...recentlyFinished];
  useEffect(() => {
    if (selectedBook) {
      const updated = allBooks.find((b) => b.id === selectedBook.id);
      if (updated) setSelectedBook(updated);
    }
  }, [currentlyReading, recentlyFinished]); // eslint-disable-line react-hooks/exhaustive-deps

  const openBook = useCallback((book: Book) => {
    setSelectedBook(book);
    setSheetOpen(true);
  }, []);

  return (
    <>
      {currentlyReading.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Currently reading
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1 h-auto p-0 hover:bg-transparent hover:text-foreground"
              asChild
            >
              <Link href="/library">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {currentlyReading.map((book) => (
              <ReadingBookCard
                key={book.id}
                book={book}
                onClick={() => openBook(book)}
              />
            ))}
          </div>
        </section>
      )}

      {recentlyFinished.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Recently finished
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground gap-1 h-auto p-0 hover:bg-transparent hover:text-foreground"
              asChild
            >
              <Link href="/library">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentlyFinished.map((book) => (
              <FinishedBookCard
                key={book.id}
                book={book}
                onClick={() => openBook(book)}
              />
            ))}
          </div>
        </section>
      )}

      <BookDetailSheet
        book={selectedBook}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
