import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ title: string }> }
) {
  const { title } = await params;
  if (!title?.trim()) {
    return NextResponse.json(
      { error: "Missing title" },
      { status: 400 }
    );
  }

  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(title)}&limit=1`
  );
  const data = await res.json();

  if (!data.docs?.length) {
    return NextResponse.json(
      { error: "No books found" },
      { status: 404 }
    );
  }

  const doc = data.docs[0];
  const book = {
    book_title: doc.title,
    author: doc.author_name?.[0] ?? "Unknown",
    cover_i: doc.cover_i,
    page_count: doc.number_of_pages ?? null,
  };

  return NextResponse.json(book);
}
