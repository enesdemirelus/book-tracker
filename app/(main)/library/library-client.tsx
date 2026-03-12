"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookDetailSheet } from "@/app/components/BookDetailSheet";
import { AddBookDialog } from "@/app/components/AddBookDialog";
import { Search, BookOpen } from "lucide-react";

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

const statusLabels: Record<string, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "Reading",
  WANT_TO_READ: "Want to read",
  COMPLETED: "Completed",
};

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline"> =
  {
    NOT_STARTED: "secondary",
    IN_PROGRESS: "default",
    WANT_TO_READ: "outline",
    COMPLETED: "default",
  };

export function LibraryClient({ books }: { books: Book[] }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (selectedBook) {
      const updated = books.find((b) => b.id === selectedBook.id);
      if (updated) setSelectedBook(updated);
    }
  }, [books]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = books.filter((book) => {
    const matchesSearch =
      !search ||
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      tab === "all" ||
      (tab === "reading" && book.readingStatus === "IN_PROGRESS") ||
      (tab === "completed" && book.readingStatus === "COMPLETED") ||
      (tab === "want" &&
        (book.readingStatus === "WANT_TO_READ" ||
          book.readingStatus === "NOT_STARTED"));

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {books.length} book{books.length !== 1 ? "s" : ""} in your
            collection
          </p>
        </div>
        <AddBookDialog />
      </div>

      <Separator />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="want">Want to read</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((book) => {
            const progress =
              book.page_count && book.page_progress != null
                ? Math.min(
                    Math.round(
                      (book.page_progress / book.page_count) * 100
                    ),
                    100
                  )
                : 0;

            return (
              <Card
                key={book.id}
                className="gap-0 py-0 cursor-pointer transition-colors hover:border-foreground/15"
                onClick={() => {
                  setSelectedBook(book);
                  setSheetOpen(true);
                }}
              >
                <CardContent className="flex items-center gap-4 p-3.5 sm:p-4">
                  {book.cover_image_url ? (
                    <Image
                      src={book.cover_image_url}
                      alt={book.title}
                      width={36}
                      height={52}
                      className="rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-[52px] rounded bg-muted flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div>
                      <p className="text-sm font-medium truncate">
                        {book.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {book.author}
                        {book.year > 0 ? ` · ${book.year}` : ""}
                      </p>
                    </div>
                    {book.readingStatus === "IN_PROGRESS" &&
                      book.page_count && (
                        <Progress value={progress} className="h-1 max-w-48" />
                      )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {book.readingStatus === "IN_PROGRESS" &&
                      book.page_count && (
                        <span className="text-xs text-muted-foreground tabular-nums hidden sm:inline">
                          {progress}%
                        </span>
                      )}
                    <Badge
                      variant={
                        statusBadgeVariant[book.readingStatus] ?? "secondary"
                      }
                      className="text-[11px]"
                    >
                      {statusLabels[book.readingStatus] ?? book.readingStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="gap-0 py-0">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <BookOpen className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">
              {books.length === 0
                ? "Your library is empty"
                : "No books match your filters"}
            </p>
            <p className="text-xs mt-1">
              {books.length === 0
                ? "Add your first book to get started"
                : "Try a different search or filter"}
            </p>
          </CardContent>
        </Card>
      )}

      <BookDetailSheet
        book={selectedBook}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
