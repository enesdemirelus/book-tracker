"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type ReadingStatus = "NOT_STARTED" | "IN_PROGRESS" | "WANT_TO_READ" | "COMPLETED";

async function getDbUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

export async function addBook(data: {
  title: string;
  author: string;
  year: number;
  cover_image_url?: string;
  page_count?: number;
  readingStatus: ReadingStatus;
}) {
  const user = await getDbUser();

  const book = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      year: data.year,
      cover_image_url: data.cover_image_url || null,
      page_count: data.page_count || null,
      page_progress: 0,
      readingStatus: data.readingStatus,
      started_at:
        data.readingStatus === "IN_PROGRESS" ? new Date() : null,
      finished_at:
        data.readingStatus === "COMPLETED" ? new Date() : null,
      userId: user.id,
    },
  });

  revalidatePath("/home");
  revalidatePath("/library");
  return book;
}

export async function updateBookProgress(
  bookId: string,
  pageProgress: number
) {
  const user = await getDbUser();

  const book = await prisma.book.findFirst({
    where: { id: bookId, userId: user.id },
  });
  if (!book) throw new Error("Book not found");

  const isFinished =
    book.page_count != null && pageProgress >= book.page_count;

  await prisma.book.update({
    where: { id: bookId },
    data: {
      page_progress: pageProgress,
      readingStatus: isFinished ? "COMPLETED" : "IN_PROGRESS",
      started_at: book.started_at ?? new Date(),
      finished_at: isFinished ? new Date() : null,
    },
  });

  revalidatePath("/home");
  revalidatePath("/library");
}

export async function updateBookPageCount(
  bookId: string,
  pageCount: number
) {
  const user = await getDbUser();

  const book = await prisma.book.findFirst({
    where: { id: bookId, userId: user.id },
  });
  if (!book) throw new Error("Book not found");

  const isFinished =
    book.page_progress != null && book.page_progress >= pageCount;

  await prisma.book.update({
    where: { id: bookId },
    data: {
      page_count: pageCount,
      readingStatus: isFinished ? "COMPLETED" : book.readingStatus,
      finished_at: isFinished ? new Date() : book.finished_at,
    },
  });

  revalidatePath("/home");
  revalidatePath("/library");
}

export async function updateBookStatus(
  bookId: string,
  status: ReadingStatus
) {
  const user = await getDbUser();

  const book = await prisma.book.findFirst({
    where: { id: bookId, userId: user.id },
  });
  if (!book) throw new Error("Book not found");

  await prisma.book.update({
    where: { id: bookId },
    data: {
      readingStatus: status,
      started_at:
        status === "IN_PROGRESS" && !book.started_at
          ? new Date()
          : book.started_at,
      finished_at: status === "COMPLETED" ? new Date() : null,
      page_progress:
        status === "COMPLETED" ? (book.page_count ?? book.page_progress) : book.page_progress,
    },
  });

  revalidatePath("/home");
  revalidatePath("/library");
}

export async function deleteBook(bookId: string) {
  const user = await getDbUser();

  await prisma.book.deleteMany({
    where: { id: bookId, userId: user.id },
  });

  revalidatePath("/home");
  revalidatePath("/library");
}

export async function getUserBooks() {
  const user = await getDbUser();

  return prisma.book.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" },
  });
}

export async function getBookStats() {
  const user = await getDbUser();

  const books = await prisma.book.findMany({
    where: { userId: user.id },
  });

  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const reading = books.filter((b) => b.readingStatus === "IN_PROGRESS");
  const completed = books.filter((b) => b.readingStatus === "COMPLETED");
  const wantToRead = books.filter(
    (b) => b.readingStatus === "WANT_TO_READ" || b.readingStatus === "NOT_STARTED"
  );
  const thisYear = completed.filter(
    (b) => b.finished_at && b.finished_at >= startOfYear
  );

  return {
    reading: reading.length,
    completed: completed.length,
    wantToRead: wantToRead.length,
    thisYear: thisYear.length,
    readingGoal: user.twenty_six_reading_goal,
    currentlyReading: reading,
    recentlyFinished: completed.slice(0, 4),
  };
}
