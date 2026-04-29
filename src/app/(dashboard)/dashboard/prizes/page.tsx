import { LatestResults } from "@/components/dashboard/LatestResults";
import { WinningsOverview } from "@/components/dashboard/WinningsOverview";
import { Trophy } from "lucide-react";

export const metadata = {
  title: "Draws & Prizes | GolfGive",
  description: "View latest draw results and manage your winnings.",
};

export default function PrizesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111120] to-[#1c1c30] border border-border rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f5c842]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f5c842]/20 to-primary/20 flex items-center justify-center border border-[#f5c842]/30 shadow-[0_0_20px_rgba(245,200,66,0.15)]">
            <Trophy className="w-6 h-6 text-[#f5c842]" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Draws & Prizes</h1>
            <p className="text-muted max-w-xl leading-relaxed">
              Check the latest monthly draw results, verify your winning numbers, and track the lifetime cash prizes you've claimed through your GolfGive membership.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
        <div className="md:col-span-2">
          <LatestResults />
        </div>
        <div className="md:col-span-2">
          <WinningsOverview />
        </div>
      </div>
    </div>
  );
}
