"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";

function Page() {
  const [inputValue, setInputValue] = useState("");
  const [book, setBook] = useState<{
    book_title: string;
    author: string;
    cover_i?: number;
    page_count: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    const query = inputValue.trim();
    if (!query) return;

    setError(null);
    setBook(null);
    setLoading(true);

    axios
      .get(`/api/search-book/${encodeURIComponent(query)}`)
      .then((res) => setBook(res.data))
      .catch((err) => {
        setError(err.response?.data?.error ?? err.message ?? "Search failed");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="m-5 flex flex-col items-center gap-4">
      <Input
        className="w-70"
        type="text"
        placeholder="Search by title..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </Button>

      {error && <p className="text-destructive text-sm">{error}</p>}

      {book && (
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-xl font-semibold">{book.book_title}</h1>
          <h2 className="text-muted-foreground">{book.author}</h2>
          {book.page_count != null && (
            <p className="text-sm">{book.page_count} pages</p>
          )}
          {book.cover_i != null ? (
            <Image
              src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
              alt={`Cover for ${book.book_title}`}
              width={160}
              height={240}
              unoptimized
            />
          ) : (
            <div className="flex h-[240px] w-[160px] items-center justify-center rounded border bg-muted text-sm text-muted-foreground">
              No cover
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
