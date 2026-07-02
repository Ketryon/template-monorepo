import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const eventType = body?.type;

  // TODO: Verify webhook signature with Stripe
  // const sig = request.headers.get("stripe-signature");

  switch (eventType) {
    case "checkout.session.completed":
      console.log("Stripe: checkout completed");
      break;
    case "customer.subscription.deleted":
      console.log("Stripe: subscription cancelled");
      break;
    case "invoice.payment_failed":
      console.log("Stripe: payment failed");
      break;
    default:
      console.log(`Unhandled Stripe event: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
