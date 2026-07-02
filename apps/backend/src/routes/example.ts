import { getAuth, requireAuth } from "@clerk/express";
import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, items } from "@ketryon/database";
import { asyncHandler, sendError, sendSuccess } from "../utils/response";
import { paginationSchema, validate } from "../utils/validation";

const router = Router();

router.use(requireAuth());

const createItemSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be 255 characters or less" })
    .transform((val: string) => val.trim()),
  description: z
    .string()
    .max(1000)
    .optional()
    .transform((val: string | undefined) => val?.trim() || null),
});

// GET /api/items — List with pagination
router.get(
  "/",
  validate(paginationSchema, "query"),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const { limit, offset } = req.query as unknown as {
      limit: number;
      offset: number;
    };

    // TODO: Replace with real query using userId lookup
    const results = await db
      .select()
      .from(items)
      .limit(limit)
      .offset(offset);

    sendSuccess(res, {
      items: results,
      pagination: { total: results.length, limit, offset, hasMore: false },
    });
  })
);

// GET /api/items/:id — Get single item
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const id = req.params.id as string;
    const [item] = await db
      .select()
      .from(items)
      .where(eq(items.id, id));

    if (!item) {
      sendError(res, "Item not found", 404);
      return;
    }

    sendSuccess(res, item);
  })
);

// POST /api/items — Create item
router.post(
  "/",
  validate(createItemSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const { name, description } = req.body as {
      name: string;
      description: string | null;
    };

    // TODO: Look up internal user ID from clerkUserId
    const [newItem] = await db
      .insert(items)
      .values({ userId: "00000000-0000-0000-0000-000000000000", name, description })
      .returning();

    sendSuccess(res, newItem, 201);
  })
);

// DELETE /api/items/:id — Delete item
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const id = req.params.id as string;
    await db.delete(items).where(eq(items.id, id));
    sendSuccess(res, { message: "Item deleted" });
  })
);

export default router;
