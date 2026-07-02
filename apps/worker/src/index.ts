import "dotenv/config";
import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/functions.js";

const app = express();
const PORT = process.env.PORT || 3005;

// Trust proxy for Railway / reverse proxies
app.set("trust proxy", true);

// Inngest serve endpoint
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "worker",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`Worker running on http://localhost:${PORT}`);
  console.log(`Inngest endpoint: http://localhost:${PORT}/api/inngest`);
});
