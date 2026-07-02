import { Router, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db, users } from "@ketryon/database";
import { asyncHandler, sendError, sendSuccess } from "../utils/response";

const router = Router();

// POST /api/webhooks/clerk — Clerk user lifecycle events
router.post(
  "/clerk",
  asyncHandler(async (req: Request, res: Response) => {
    const eventType = req.body?.type;

    // TODO: Verify webhook signature with Svix
    // const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    // wh.verify(payload, headers);

    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name } = req.body.data;
        const email = email_addresses?.[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        await db.insert(users).values({ clerkUserId: id, email, name });
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name } = req.body.data;
        const email = email_addresses?.[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        await db
          .update(users)
          .set({ email, name, updatedAt: new Date() })
          .where(eq(users.clerkUserId, id));
        break;
      }

      case "user.deleted": {
        const { id } = req.body.data;
        await db.delete(users).where(eq(users.clerkUserId, id));
        break;
      }

      default:
        console.log(`Unhandled Clerk event: ${eventType}`);
    }

    sendSuccess(res, { received: true });
  })
);

// POST /api/webhooks/stripe — Stripe payment events
router.post(
  "/stripe",
  asyncHandler(async (req: Request, res: Response) => {
    const eventType = req.body?.type;

    // TODO: Verify webhook signature with Stripe
    // const sig = req.headers["stripe-signature"];
    // const event = stripe.webhooks.constructEvent(rawBody, sig, secret);

    switch (eventType) {
      case "checkout.session.completed": {
        // TODO: Update user membership to premium
        console.log("Checkout completed:", req.body.data.object.id);
        break;
      }

      case "customer.subscription.deleted": {
        // TODO: Downgrade user membership to free
        console.log("Subscription cancelled:", req.body.data.object.id);
        break;
      }

      case "invoice.payment_failed": {
        // TODO: Handle payment failure (notify user)
        console.log("Payment failed:", req.body.data.object.id);
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${eventType}`);
    }

    sendSuccess(res, { received: true });
  })
);

export default router;
