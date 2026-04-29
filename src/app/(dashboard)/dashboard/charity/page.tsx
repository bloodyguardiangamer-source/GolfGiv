import { CharityModule } from "@/components/dashboard/CharityModule";
import { HeartHandshake } from "lucide-react";

export const metadata = {
  title: "My Charity | GolfGive",
  description: "Manage your charity selection and contribution settings.",
};

export default function CharityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111120] to-[#1c1c30] border border-border rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(151,255,42,0.15)]">
            <HeartHandshake className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">My Charity Impact</h1>
            <p className="text-muted max-w-xl leading-relaxed">
              Every month, a percentage of your subscription goes directly to the charity of your choice. You have full control over who you support and how much you give.
            </p>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
        <CharityModule />
      </div>
    </div>
  );
}
