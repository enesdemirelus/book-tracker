"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Loader2, Trash2 } from "lucide-react";
import {
  updateBookProgress,
  updateBookPageCount,
  updateBookStatus,
  deleteBook,
} from "@/app/actions/books";
import { toast } from "sonner";

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

export function BookDetailSheet({
  book,
  open,
  onOpenChange,
}: {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [pageInput, setPageInput] = useState("");
  const [totalPagesInput, setTotalPagesInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [localProgress, setLocalProgress] = useState<number>(0);
  const [localPageCount, setLocalPageCount] = useState<number | null>(null);
  const [localStatus, setLocalStatus] = useState<string>("WANT_TO_READ");

  useEffect(() => {
    if (book) {
      setLocalProgress(book.page_progress ?? 0);
      setLocalPageCount(book.page_count);
      setLocalStatus(book.readingStatus);
      setPageInput("");
      setTotalPagesInput("");
      setConfirmDelete(false);
    }
  }, [book]);

  if (!book) return null;

  const hasPageCount = localPageCount != null && localPageCount > 0;
  const progressPercent = hasPageCount
    ? Math.min(Math.round((localProgress / localPageCount) * 100), 100)
    : null;

  function handleUpdateProgress() {
    if (!book) return;
    const pages = parseInt(pageInput);
    if (isNaN(pages) || pages < 0) {
      toast.error("Enter a valid page number");
      return;
    }

    setLocalProgress(pages);
    if (localPageCount && pages >= localPageCount) {
      setLocalStatus("COMPLETED");
    } else if (pages > 0 && localStatus !== "IN_PROGRESS") {
      setLocalStatus("IN_PROGRESS");
    }

    startTransition(async () => {
      try {
        await updateBookProgress(book.id, pages);
        toast.success(`Progress updated to page ${pages}`);
        setPageInput("");
      } catch {
        setLocalProgress(book.page_progress ?? 0);
        setLocalStatus(book.readingStatus);
        toast.error("Failed to update progress");
      }
    });
  }

  function handleSetTotalPages() {
    if (!book) return;
    const total = parseInt(totalPagesInput);
    if (isNaN(total) || total <= 0) {
      toast.error("Enter a valid page count");
      return;
    }

    setLocalPageCount(total);
    if (localProgress >= total) {
      setLocalStatus("COMPLETED");
    }

    startTransition(async () => {
      try {
        await updateBookPageCount(book.id, total);
        toast.success("Total pages updated");
        setTotalPagesInput("");
      } catch {
        setLocalPageCount(book.page_count);
        setLocalStatus(book.readingStatus);
        toast.error("Failed to update page count");
      }
    });
  }

  function handleStatusChange(status: string) {
    if (!book) return;

    setLocalStatus(status);
    if (status === "COMPLETED" && localPageCount) {
      setLocalProgress(localPageCount);
    }

    startTransition(async () => {
      try {
        await updateBookStatus(
          book.id,
          status as
            | "NOT_STARTED"
            | "IN_PROGRESS"
            | "WANT_TO_READ"
            | "COMPLETED"
        );
        toast.success("Status updated");
      } catch {
        setLocalStatus(book.readingStatus);
        setLocalProgress(book.page_progress ?? 0);
        toast.error("Failed to update status");
      }
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (!book) return;
    startTransition(async () => {
      try {
        await deleteBook(book.id);
        toast.success(`"${book.title}" removed`);
        onOpenChange(false);
        setConfirmDelete(false);
      } catch {
        toast.error("Failed to delete book");
      }
    });
  }

  const formatDate = (d: Date | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const startedDate = formatDate(book.started_at);
  const finishedDate = formatDate(book.finished_at);

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setConfirmDelete(false);
      }}
    >
      <SheetContent className="overflow-y-auto sm:max-w-md p-0 flex flex-col">
        <div className="bg-muted/40 px-6 pt-10 pb-6">
          <div className="flex gap-5">
            {book.cover_image_url ? (
              <Image
                src={book.cover_image_url}
                alt={book.title}
                width={100}
                height={150}
                className="rounded-lg object-cover shrink-0 shadow-md"
              />
            ) : (
              <div className="w-[100px] h-[150px] rounded-lg bg-muted flex items-center justify-center shrink-0 shadow-md border">
                <BookOpen className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
            <div className="flex flex-col justify-center min-w-0 gap-1">
              <SheetHeader className="p-0 space-y-0">
                <SheetTitle className="text-left text-lg leading-snug line-clamp-3">
                  {book.title}
                </SheetTitle>
                <SheetDescription className="text-left text-sm mt-1">
                  {book.author}
                </SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {book.year > 0 && <span>{book.year}</span>}
                {book.year > 0 && hasPageCount && (
                  <span className="text-border">&middot;</span>
                )}
                {hasPageCount && <span>{localPageCount} pages</span>}
              </div>
              {(startedDate || finishedDate) && (
                <div className="text-[11px] text-muted-foreground/70 mt-1 space-y-0.5">
                  {startedDate && <p>Started {startedDate}</p>}
                  {finishedDate && <p>Finished {finishedDate}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">
          {/* Total pages — only shown if unknown */}
          {!hasPageCount && (
            <div className="space-y-2 rounded-lg border border-dashed p-4">
              <Label className="text-sm font-medium">
                How many pages does this book have?
              </Label>
              <p className="text-xs text-muted-foreground">
                Set the total page count to track your reading progress.
              </p>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  placeholder="Total pages"
                  value={totalPagesInput}
                  onChange={(e) => setTotalPagesInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSetTotalPages()
                  }
                  min={1}
                  className="tabular-nums"
                />
                <Button
                  onClick={handleSetTotalPages}
                  disabled={isPending || !totalPagesInput}
                  size="sm"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Set"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Progress — shown when page count is known */}
          {hasPageCount && (
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <Label className="text-sm font-medium">Progress</Label>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {localProgress} of {localPageCount} pages &middot;{" "}
                  {progressPercent}%
                </span>
              </div>
              <Progress value={progressPercent ?? 0} className="h-2" />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`Current page (0–${localPageCount})`}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleUpdateProgress()
                  }
                  min={0}
                  max={localPageCount}
                  className="tabular-nums"
                />
                <Button
                  onClick={handleUpdateProgress}
                  disabled={isPending || !pageInput}
                  size="sm"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Reading status</Label>
            <Select
              value={localStatus}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue>
                  {statusLabels[localStatus] ?? localStatus}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WANT_TO_READ">Want to read</SelectItem>
                <SelectItem value="NOT_STARTED">Not started</SelectItem>
                <SelectItem value="IN_PROGRESS">Currently reading</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="border-t px-6 py-4">
          <Button
            variant={confirmDelete ? "destructive" : "ghost"}
            size="sm"
            className="w-full gap-1.5"
            onClick={handleDelete}
            disabled={isPending}
            onBlur={() => setConfirmDelete(false)}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                {confirmDelete
                  ? "Click again to confirm"
                  : "Remove from library"}
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
