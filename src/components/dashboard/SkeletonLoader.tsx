import { Loader2 } from "lucide-react";

export function SkeletonLoader() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="space-y-3">
        <div className="h-10 w-48 bg-white/5 animate-pulse rounded-md" />
        <div className="h-5 w-96 bg-white/5 animate-pulse rounded-md" />
      </div>

      <div className="bg-[#111120] border border-border rounded-xl p-8 relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-32 bg-white/5 animate-pulse rounded-md" />
              <div className="h-4 w-24 bg-white/5 animate-pulse rounded-md" />
            </div>
          </div>
          <div className="h-10 w-24 bg-white/5 animate-pulse rounded-md" />
        </div>

        <div className="space-y-4">
          <div className="h-16 w-full bg-[#1c1c30] animate-pulse rounded-md" />
          <div className="h-16 w-full bg-[#1c1c30] animate-pulse rounded-md" />
          <div className="h-16 w-full bg-[#1c1c30] animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
