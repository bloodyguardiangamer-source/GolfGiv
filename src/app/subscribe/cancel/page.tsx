"use client";

import { motion } from "framer-motion";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-[#111120] border border-[#2c2c48] rounded-[12px] p-8 text-center shadow-2xl"
      >
        <div className="mx-auto w-16 h-16 bg-[#ff6b4a20] rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-8 h-8 text-[#ff6b4a]" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-white mb-4">
          Payment Cancelled
        </h1>

        <p className="text-[#9595b5] text-sm mb-8 leading-relaxed">
          Your secure checkout process was interrupted. No charges have been
          made. You can try again whenever you're ready.
        </p>

        <Link
          href="/subscribe"
          className="inline-flex items-center justify-center gap-2 w-full bg-transparent border border-[#2c2c48] hover:border-[#b8f55a] text-white hover:text-[#b8f55a] py-3 px-6 rounded-[8px] font-bold text-[14px] tracking-[0.02em] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </Link>
      </motion.div>
    </div>
  );
}
