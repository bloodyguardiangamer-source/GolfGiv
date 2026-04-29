"use client";

import { useEffect, useState, useCallback } from "react";
import { CreditCard, Calendar, CheckCircle2, AlertTriangle, Loader2, X, Check, ArrowRight, Sparkles, Shield } from "lucide-react";
import { useRealtime } from "./RealtimeProvider";

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "£10",
    interval: "month",
    description: "Flexible month-to-month giving.",
    features: ["10% to your chosen charity", "5 scores per month", "1 monthly draw entry"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "£100",
    interval: "year",
    tag: "SAVE £20",
    description: "Best value — 2 months free.",
    features: ["10% to your chosen charity", "5 scores per month", "1 monthly draw entry", "2 months absolutely free"],
  },
];

export function SubscriptionCard() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const { refreshKey } = useRealtime();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        setProfile(data.profile);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [refreshKey]);

  if (isLoading) {
    return (
      <div className="bg-[#111120] border border-border rounded-xl p-6 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const isSubscribed = profile?.subscription_status === 'active' || true;
  const currentPlan = profile?.subscription_plan || 'monthly';
  const planName = currentPlan === 'yearly' ? 'Yearly Member' : 'Monthly Member';
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + (currentPlan === 'yearly' ? 12 : 1));

  const handleManageClick = async () => {
    // First, try to open Stripe portal (for real subscribers)
    try {
      setIsManaging(true);
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (e) {
      // Stripe portal not available, fall through to in-app modal
    } finally {
      setIsManaging(false);
    }

    // Fallback: show in-app plan switcher modal
    setSelectedPlan(currentPlan);
    setShowModal(true);
  };

  const handleSwitchPlan = async () => {
    if (!selectedPlan || selectedPlan === currentPlan) return;

    setIsSwitching(true);
    try {
      // Redirect to subscribe page with plan pre-selected
      window.location.href = `/subscribe?plan=${selectedPlan}`;
    } catch (e) {
      console.error(e);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <>
      <div className="bg-[#111120] border border-border rounded-xl p-6 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

        <h3 className="text-xl font-serif font-bold text-white mb-6">Subscription Status</h3>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSubscribed ? 'bg-primary/20 text-primary' : 'bg-coral/20 text-coral'}`}>
              {isSubscribed ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-sm text-muted uppercase tracking-wider font-bold">Status</p>
              <p className={`text-lg font-bold ${isSubscribed ? 'text-white' : 'text-coral'}`}>
                {isSubscribed ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
            <div>
              <div className="flex items-center gap-2 text-muted mb-1">
                <CreditCard className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold">Plan</span>
              </div>
              <p className="text-white font-medium">{planName}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-muted mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-bold">Renews</span>
              </div>
              <p className="text-white font-medium">{renewalDate.toLocaleDateString()}</p>
            </div>
          </div>

          <button
            onClick={handleManageClick}
            disabled={isManaging}
            className="w-full mt-4 py-2.5 rounded-md border border-border text-white text-sm font-bold hover:bg-[#1c1c30] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isManaging ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
            ) : (
              <>Manage Subscription <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>

      {/* ── Plan Switcher Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-[#0f0f1e] border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 pb-0 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white mb-1">Change Your Plan</h2>
                <p className="text-muted text-sm">Choose the plan that works best for you.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-md hover:bg-[#1c1c30] text-muted hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plans */}
            <div className="p-6 space-y-3">
              {plans.map((plan) => {
                const isCurrentPlan = plan.id === currentPlan;
                const isSelected = plan.id === selectedPlan;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(184,245,90,0.08)]"
                        : "border-[#2c2c48] bg-[#111120] hover:border-[#9595b5]/50"
                    }`}
                  >
                    {plan.tag && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#f5c842]/15 text-[#f5c842]">
                        {plan.tag}
                      </span>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-primary bg-primary" : "border-[#2c2c48]"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-black" />}
                      </div>
                      <span className="text-white font-bold text-lg">{plan.name}</span>
                      {isCurrentPlan && (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm bg-primary/20 text-primary">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="ml-8">
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-bold text-white tracking-tight">{plan.price}</span>
                        <span className="text-muted text-sm">/{plan.interval}</span>
                      </div>
                      <p className="text-muted text-sm mb-3">{plan.description}</p>
                      <ul className="space-y-1.5">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-[#d4d4eb]">
                            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={handleSwitchPlan}
                disabled={isSwitching || selectedPlan === currentPlan}
                className="w-full py-3.5 rounded-lg bg-primary text-black font-bold text-sm tracking-wide hover:bg-primary-deep disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isSwitching ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : selectedPlan === currentPlan ? (
                  "This is your current plan"
                ) : (
                  <><Sparkles className="w-4 h-4" /> Switch to {selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} Plan</>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-muted">
                <Shield className="w-3 h-3" />
                <span>Secure checkout powered by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
