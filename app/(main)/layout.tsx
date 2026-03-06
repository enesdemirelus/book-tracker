import { Navbar } from "@/app/components/Navbar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId) {
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress;

    await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email },
    });
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
