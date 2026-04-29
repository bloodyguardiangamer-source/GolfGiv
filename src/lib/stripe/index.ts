import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is missing. Please set it in your .env.local file.",
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // @ts-ignore - Ignore the exact API version strict typing requirement for now
  apiVersion: "2023-10-16",
  typescript: true,
  appInfo: {
    name: "GolfGive Platform",
    version: "1.0.0",
  },
});
