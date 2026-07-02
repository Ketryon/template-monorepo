import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

export const uuidSchema = z.string().uuid({ message: "Invalid UUID format" });

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100).catch(100),
  offset: z.coerce.number().int().min(0).default(0).catch(0),
});

export const sortBySchema = z
  .enum(["name", "createdAt", "updatedAt"])
  .default("createdAt");

export const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");

export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function validate<T extends z.ZodSchema>(
  schema: T,
  source: "body" | "query" | "params" = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((err: z.ZodIssue) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    (req as unknown as Record<string, unknown>)[source] = result.data;
    next();
  };
}

export type PaginationInput = z.infer<typeof paginationSchema>;
