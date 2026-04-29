import { ScoreEntry } from "@/components/dashboard/ScoreEntry";
import { Target } from "lucide-react";

export const metadata = {
  title: "My Scores | GolfGive",
  description: "Manage your golf scores for the monthly draw.",
};

export default function ScoresPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111120] to-[#1c1c30] border border-border rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5c842]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-[#f5c842]/20 flex items-center justify-center border border-[#f5c842]/30 shadow-[0_0_15px_rgba(245,200,66,0.15)]">
            <Target className="w-6 h-6 text-[#f5c842]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">My Scores</h1>
            <p className="text-muted max-w-xl leading-relaxed">
              Submit your 5 best scores of the month to generate your unique lottery numbers. Keep them updated to stay eligible for the grand prize draw.
            </p>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
        <ScoreEntry />
      </div>
    </div>
  );
}
