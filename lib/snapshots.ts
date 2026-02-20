import { prisma } from "./prisma";
import { fetchPortfolio } from "./portfolio";

export async function saveSnapshot(walletAddress: string): Promise<void> {
  const portfolio = await fetchPortfolio(walletAddress);

  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { walletAddress },
      update: {},
      create: { walletAddress },
    });

    await tx.snapshot.create({
      data: {
        walletAddress,
        totalValueUsd: portfolio.totalValueUsd,
        chainData: portfolio.chains as object,
      },
    });
  });
}

export async function getSnapshots(walletAddress: string, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return prisma.snapshot.findMany({
    where: {
      walletAddress,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      totalValueUsd: true,
      createdAt: true,
      chainData: true,
    },
  });
}

export async function getTrackedWallets(): Promise<string[]> {
  const users = await prisma.user.findMany({
    select: { walletAddress: true },
  });
  return users.map((u) => u.walletAddress);
}
