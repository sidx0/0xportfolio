import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { saveSnapshot } from "../lib/snapshots";

const prisma = new PrismaClient();

async function runDailySnapshots(): Promise<void> {
  console.log(`[cron] Running daily snapshot job at ${new Date().toISOString()}`);

  const users = await prisma.user.findMany({
    select: { walletAddress: true },
  });

  if (users.length === 0) {
    console.log("[cron] No tracked wallets found.");
    return;
  }

  const results = await Promise.allSettled(
    users.map((u) => saveSnapshot(u.walletAddress))
  );

  let success = 0;
  let failed = 0;

  results.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(`[cron] Snapshot saved for ${users[i].walletAddress}`);
      success++;
    } else {
      console.error(`[cron] Failed for ${users[i].walletAddress}:`, r.reason);
      failed++;
    }
  });

  console.log(`[cron] Done. Success: ${success}, Failed: ${failed}`);
}

// Run at midnight UTC daily
cron.schedule("0 0 * * *", runDailySnapshots, {
  timezone: "UTC",
});

console.log("[cron] Snapshot scheduler started. Runs daily at 00:00 UTC.");

// Graceful shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
