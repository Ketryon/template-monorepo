import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "DATABASE_URL not set. Database queries will fail until configured."
  );
}

const client = postgres(connectionString || "");
export const db = drizzle(client, { schema });

// Re-export schema for consumers
export * from "./db/schema";
