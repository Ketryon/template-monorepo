import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const eventType = body?.type;

  // TODO: Verify webhook signature with Svix

  switch (eventType) {
    case "user.created":
    case "user.updated":
    case "user.deleted":
      // Forward to backend or handle directly
      console.log(`Clerk webhook: ${eventType}`);
      break;
    default:
      console.log(`Unhandled Clerk event: ${eventType}`);
  }

  return NextResponse.json({ received: true });
}
