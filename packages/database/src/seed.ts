import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./db/schema";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client, { schema });

  console.log("Seeding database...");

  // TODO: Add your seed data here
  // Example:
  // await db.insert(schema.users).values({ ... });

  console.log("Seeding complete.");
  await client.end();
}

seed().catch(console.error);
