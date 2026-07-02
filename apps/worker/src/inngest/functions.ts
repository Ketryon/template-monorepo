import { inngest } from "./client.js";

/**
 * Example: Process an item after upload
 *
 * Trigger from backend: inngest.send({ name: "item/process", data: { itemId } })
 */
const processItem = inngest.createFunction(
  {
    id: "process-item",
    retries: 3,
  },
  { event: "item/process" },
  async ({ event, step }) => {
    const { itemId } = event.data as { itemId: string };

    // Step 1: Fetch the item
    const item = await step.run("fetch-item", async () => {
      // TODO: Import db from @ketryon/database or use direct postgres
      console.log(`Fetching item ${itemId}`);
      return { id: itemId, name: "example" };
    });

    // Step 2: Do heavy processing
    await step.run("process", async () => {
      // TODO: Text extraction, embeddings, image processing, etc.
      console.log(`Processing item: ${item.name}`);
    });

    // Step 3: Mark as complete
    await step.run("mark-complete", async () => {
      // TODO: Update item.processed = true in database
      console.log(`Item ${itemId} processing complete`);
    });

    return { success: true, itemId };
  }
);

/**
 * Example: Scheduled cleanup job
 *
 * Runs daily at midnight UTC
 */
const dailyCleanup = inngest.createFunction(
  {
    id: "daily-cleanup",
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    const deleted = await step.run("cleanup-stale", async () => {
      // TODO: Delete stale pending records, orphaned files, etc.
      console.log("Running daily cleanup");
      return 0;
    });

    return { deleted };
  }
);

// Export all functions for the Inngest serve handler
export const functions = [processItem, dailyCleanup];
