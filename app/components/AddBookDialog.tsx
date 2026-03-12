"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Loader2, BookOpen } from "lucide-react";
import { addBook } from "@/app/actions/books";
import { toast } from "sonner";

type SearchResult = {
  title: string;
  author: string;
  year: number;
  cover_i: number | null;
  page_count: number | null;
};

export function AddBookDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState("WANT_TO_READ");
  const [isPending, startTransition] = useTransition();

  async function handleSearch() {
    if (!query.trim()) return;
    setSearching(true);
    setSelected(null);
    try {
      const res = await fetch(
        `/api/search-book/${encodeURIComponent(query.trim())}`
      );
      if (!res.ok) {
        setResults([]);
        return;
      }
      const data = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleAdd() {
    if (!selected) return;
    startTransition(async () => {
      try {
        const coverUrl = selected.cover_i
          ? `https://covers.openlibrary.org/b/id/${selected.cover_i}-M.jpg`
          : undefined;

        await addBook({
          title: selected.title,
          author: selected.author,
          year: selected.year,
          cover_image_url: coverUrl,
          page_count: selected.page_count ?? undefined,
          readingStatus: status as
            | "WANT_TO_READ"
            | "IN_PROGRESS"
            | "COMPLETED"
            | "NOT_STARTED",
        });

        toast.success(`"${selected.title}" added to your library`);
        setOpen(false);
        setQuery("");
        setResults([]);
        setSelected(null);
      } catch {
        toast.error("Failed to add book");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 shrink-0">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add book</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add a book</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            placeholder="Search by title or author..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 -mx-1 px-1">
          {results.map((book, i) => (
            <button
              key={`${book.title}-${i}`}
              onClick={() => setSelected(book)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${
                selected === book
                  ? "bg-primary/10 ring-1 ring-primary/30"
                  : "hover:bg-accent"
              }`}
            >
              {book.cover_i ? (
                <Image
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                  alt={book.title}
                  width={32}
                  height={48}
                  className="rounded object-cover shrink-0"
                />
              ) : (
                <div className="w-8 h-12 rounded bg-muted flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {book.author}
                  {book.year ? ` · ${book.year}` : ""}
                  {book.page_count ? ` · ${book.page_count}p` : ""}
                </p>
              </div>
            </button>
          ))}

          {results.length === 0 && !searching && query && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No results found. Try a different search.
            </p>
          )}

          {!query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Search className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">Search for a book to add</p>
            </div>
          )}
        </div>

        {selected && (
          <div className="flex items-center gap-3 pt-3 border-t">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WANT_TO_READ">Want to read</SelectItem>
                <SelectItem value="IN_PROGRESS">Currently reading</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
