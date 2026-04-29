import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"; // Need a service role client to bypass RLS

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return NextResponse.json(
      { error: "Missing webhook secret or signature" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  // Handle the event
  const session = event.data.object as any;

  // Uses Service Role Key because webhook runs without user session
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  switch (event.type) {
    case "checkout.session.completed":
      if (session.client_reference_id) {
        const userId = session.client_reference_id;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        // Retrieve subscription for details
        const subscription: any =
          await stripe.subscriptions.retrieve(subscriptionId);

        // Update Users Table
        await supabaseAdmin
          .from("users")
          .update({
            subscription_status: "active",
            subscription_id: subscriptionId,
            subscription_plan:
              subscription.items.data[0].plan.interval === "month"
                ? "monthly"
                : "yearly",
          })
          .eq("id", userId);

        // Insert into audit log
        await supabaseAdmin.from("subscriptions").insert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          status: subscription.status,
          current_period_end: new Date(
            subscription.current_period_end * 1000,
          ).toISOString(),
          amount: session.amount_total! / 100, // Converts cents
          plan:
            subscription.items.data[0].plan.interval === "month"
              ? "monthly"
              : "yearly",
        });
      }
      break;

    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      {
        const sub: any = event.data.object;

        let subStatus = "active";
        if (sub.status === "past_due" || sub.status === "unpaid")
          subStatus = "lapsed";
        if (sub.status === "canceled") subStatus = "cancelled";

        await supabaseAdmin
          .from("users")
          .update({ subscription_status: subStatus })
          .eq("subscription_id", sub.id);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: sub.status,
            current_period_end: new Date(
              sub.current_period_end * 1000,
            ).toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
      }
      break;

    case "invoice.payment_failed":
      {
        const invoice: any = event.data.object;
        if (invoice.subscription) {
          await supabaseAdmin
            .from("users")
            .update({ subscription_status: "lapsed" })
            .eq("subscription_id", invoice.subscription as string);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
