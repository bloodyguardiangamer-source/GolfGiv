"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Shield, Loader2 } from "lucide-react";
import { useAuthModal } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    name: "Monthly",
    id: "monthly",
    price: "£10",
    interval: "month",
    description: "Perfect for flexible giving.",
    features: [
      "10% to your chosen charity",
      "5 scores per month",
      "1 entry into the monthly draw",
    ],
  },
  {
    name: "Yearly",
    id: "yearly",
    price: "£100",
    interval: "year",
    tag: "MOST POPULAR",
    description: "Get 2 months free when you commit.",
    features: [
      "10% to your chosen charity",
      "5 scores per month",
      "1 entry into the monthly draw",
      "2 months absolutely free",
    ],
  },
];

function SubscribeContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") === "monthly" ? "monthly" : "yearly";
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const { openAuth } = useAuthModal();
  const supabase = createClient();

  const handleSubscribe = async () => {
    setLoading(true);

    // Check auth
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      openAuth("login");
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan,
          priceId:
            selectedPlan === "monthly"
              ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
              : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
        }),
      });

      const { url, error } = await res.json();

      if (error) {
        throw new Error(error);
      }

      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-12 px-4 selection:bg-[#b8f55a] selection:text-[#0a0a14]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 max-w-2xl"
        >
          <div className="text-[11px] font-medium tracking-[0.12em] text-[#9595b5] uppercase mb-4">
            Subscription
          </div>
          <h1 className="text-white text-5xl md:text-6xl font-serif font-bold mb-6 italic text-balance leading-tight">
            Play. Give. <span className="text-[#b8f55a]">Win.</span>
          </h1>
          <p className="text-[#9595b5] text-base md:text-lg">
            Choose your membership and start contributing to your chosen charity
            while gaining access to the monthly prize draw.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`
                relative rounded-[12px] p-6 lg:p-8 cursor-pointer transition-all duration-300
                ${
                  selectedPlan === plan.id
                    ? "bg-[#1c1c30] border border-[#b8f55a] shadow-[0_0_20px_rgba(184,245,90,0.1)] transform scale-[1.02]"
                    : "bg-[#111120] border border-[#2c2c48] hover:border-[#9595b5]/50 hover:bg-[#1a1a2e]"
                }
              `}
            >
              {plan.tag && (
                <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#b8f55a20] text-[#b8f55a] text-[11px] font-semibold px-3 py-1 rounded-full tracking-[0.06em]">
                  {plan.tag}
                </div>
              )}

              <h2 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h2>
              <p className="text-[#9595b5] text-sm mb-6">{plan.description}</p>

              <div className="mb-8">
                <span className="text-4xl md:text-5xl font-bold text-[#ffffff] tracking-[-2px]">
                  {plan.price}
                </span>
                <span className="text-[#9595b5] text-sm ml-2 font-medium">
                  /{plan.interval}
                </span>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, j) => (
                  <li
                    key={j}
                    className="flex items-start text-sm text-[#d4d4eb]"
                  >
                    <Check className="w-5 h-5 text-[#b8f55a] shrink-0 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`
                w-full h-12 rounded-lg flex items-center justify-center font-bold text-[14px] tracking-[0.02em] transition-colors
                ${
                  selectedPlan === plan.id
                    ? "bg-[#b8f55a] text-[#0a0a14]"
                    : "bg-transparent border border-[#2c2c48] text-white"
                }
              `}
              >
                {selectedPlan === plan.id ? "Selected Plan" : "Select Plan"}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 w-full max-w-4xl"
        >
          <button
            disabled={loading}
            onClick={handleSubscribe}
            className="w-full bg-[#b8f55a] hover:bg-[#8bdd2a] text-[#0a0a14] py-4 rounded-[8px] font-bold text-lg tracking-[0.02em] transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Secure Checkout"}
            <Shield className="w-5 h-5" />
          </button>

          <div className="text-center text-[12px] text-[#9595b5] mt-4 flex items-center justify-center gap-2">
            <Shield className="w-3 h-3" />
            Guaranteed safe & secure checkout powered by Stripe
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SubscribeLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#b8f55a] animate-spin" />
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<SubscribeLoading />}>
      <SubscribeContent />
    </Suspense>
  );
}
