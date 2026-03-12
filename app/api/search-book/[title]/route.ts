import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ title: string }> }
) {
  const { title } = await params;
  if (!title?.trim()) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(title)}&limit=10`
  );
  const data = await res.json();

  if (!data.docs?.length) {
    return NextResponse.json({ error: "No books found" }, { status: 404 });
  }

  const books = data.docs.map(
    (doc: {
      title: string;
      author_name?: string[];
      first_publish_year?: number;
      cover_i?: number;
      number_of_pages_median?: number;
    }) => ({
      title: doc.title,
      author: doc.author_name?.[0] ?? "Unknown",
      year: doc.first_publish_year ?? 0,
      cover_i: doc.cover_i ?? null,
      page_count: doc.number_of_pages_median ?? null,
    })
  );

  return NextResponse.json(books);
}
