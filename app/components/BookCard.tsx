"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, BookOpen } from "lucide-react";

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

export function ReadingBookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick: () => void;
}) {
  const progress =
    book.page_count && book.page_progress != null
      ? Math.min(Math.round((book.page_progress / book.page_count) * 100), 100)
      : 0;

  const pagesLeft =
    book.page_count && book.page_progress != null
      ? book.page_count - book.page_progress
      : null;

  return (
    <Card
      className="group gap-0 py-0 cursor-pointer transition-colors hover:border-foreground/15"
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          {book.cover_image_url ? (
            <Image
              src={book.cover_image_url}
              alt={book.title}
              width={36}
              height={48}
              className="rounded-md object-cover shrink-0"
            />
          ) : (
            <div className="h-12 w-9 rounded-md bg-muted flex items-center justify-center shrink-0">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight line-clamp-1">
              {book.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {book.author}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Progress value={progress} className="h-1" />
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{progress}%</span>
            {pagesLeft != null && <span>{pagesLeft} pages left</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FinishedBookCard({
  book,
  onClick,
}: {
  book: Book;
  onClick: () => void;
}) {
  return (
    <Card
      className="group gap-0 py-0 cursor-pointer transition-colors hover:border-foreground/15"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
        {book.cover_image_url ? (
          <Image
            src={book.cover_image_url}
            alt={book.title}
            width={28}
            height={40}
            className="rounded object-cover shrink-0"
          />
        ) : (
          <div className="h-10 w-7 rounded bg-muted flex items-center justify-center shrink-0">
            <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{book.title}</p>
          <p className="text-xs text-muted-foreground truncate">
            {book.author}
          </p>
        </div>
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-3 w-3 fill-amber-400 text-amber-400"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
