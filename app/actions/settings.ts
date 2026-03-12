"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateReadingGoal(goal: number | null) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { clerkId: userId },
    data: { twenty_six_reading_goal: goal },
  });

  revalidatePath("/home");
  revalidatePath("/settings");
}

export async function getUserSettings() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      email: true,
      twenty_six_reading_goal: true,
    },
  });

  if (!user) throw new Error("User not found");
  return user;
}
