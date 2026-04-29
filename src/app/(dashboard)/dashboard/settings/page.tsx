import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { createClient } from "@/lib/supabase/server";
import { Settings as SettingsIcon } from "lucide-react";

export const metadata = {
  title: "Settings | GolfGive",
  description: "Manage your profile and account settings.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#111120] to-[#1c1c30] border border-border rounded-2xl p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <SettingsIcon className="w-6 h-6 text-white/80" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Account Settings</h1>
            <p className="text-muted max-w-xl leading-relaxed">
              Manage your personal profile, email preferences, and GolfGive membership subscription securely in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
        <div className="space-y-6">
          <div className="bg-[#111120] border border-border rounded-xl p-6">
            <h2 className="text-lg font-serif font-bold text-white mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1 block">Email Address</label>
                <input 
                  type="email" 
                  disabled 
                  value={user?.email || ""} 
                  className="w-full bg-[#1c1c30] border border-border rounded-lg p-3 text-white opacity-50 cursor-not-allowed focus:outline-none"
                />
                <p className="text-xs text-muted mt-2">Email address cannot be changed currently.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SubscriptionCard />
        </div>
      </div>
    </div>
  );
}
