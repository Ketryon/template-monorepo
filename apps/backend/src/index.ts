import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { standardLimiter } from "./middleware/rateLimit";
import exampleRoutes from "./routes/example";
import healthRoutes from "./routes/health";
import webhookRoutes from "./routes/webhooks";
import "./services/redis";

const app: Application = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ─────────────────────────────────────────

app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(clerkMiddleware());
app.use("/api", standardLimiter);

// ─── Routes ────────────────────────────────────────────

app.use("/health", healthRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/items", exampleRoutes);

// API info
app.get("/api", (_req: Request, res: Response) => {
  res.json({
    name: "Monorepo Backend API",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      items: "GET/POST/DELETE /api/items",
      webhooks: "POST /api/webhooks/clerk, POST /api/webhooks/stripe",
    },
    authentication: { type: "Bearer token (Clerk JWT)" },
    rateLimit: { standard: "500 requests per minute" },
  });
});

// ─── Error handlers ────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Start ─────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
