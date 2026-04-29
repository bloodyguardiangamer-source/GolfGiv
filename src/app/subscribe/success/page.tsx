"use client";

import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="max-w-md w-full bg-[#111120] border border-[#2c2c48] rounded-[12px] p-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#b8f55a] opacity-10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#b8f55a] opacity-10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="mx-auto w-16 h-16 bg-[#b8f55a20] rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-[#b8f55a]" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-white mb-2">
          Welcome to GolfGive
        </h1>
        <p className="text-[11px] font-medium tracking-[0.12em] text-[#b8f55a] uppercase mb-6">
          Subscription Active
        </p>

        <p className="text-[#9595b5] text-[13px] mb-8 leading-relaxed px-4">
          Your payment was successful and your account is now ready. Start
          entering your scores to enter the monthly prize draw and help your
          charity of choice.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 w-full bg-[#b8f55a] hover:bg-[#8bdd2a] text-[#0a0a14] py-3 px-6 rounded-[8px] font-bold text-[14px] tracking-[0.02em] transition-all hover:scale-[1.02]"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
