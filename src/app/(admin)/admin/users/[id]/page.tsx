import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, User, Shield, Activity, CreditCard, Heart, Trophy } from "lucide-react";
import { UserAdminActions } from "@/components/admin/UserAdminActions";

export const metadata = {
  title: "User Details | Admin | GolfGive",
};

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*, charities(name)")
    .eq("id", id)
    .single();

  if (!user) {
    notFound();
  }

  // Fetch scores
  const { data: scores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("score_date", { ascending: false });

  // Fetch subscriptions
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch winnings
  const { data: winnings } = await supabase
    .from("winners")
    .select("*, draw_entries(match_count, draws(draw_month))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 hover:bg-[#1c1c30] rounded-full transition-colors text-muted hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">{user.full_name}</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>
        <UserAdminActions userId={user.id} currentRole={user.role} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-white">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest ${
                  user.subscription_status === "active"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted/20 text-muted"
                }`}
              >
                {user.subscription_status}
              </span>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Role</p>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted" />
                <span className="text-white capitalize">{user.role}</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Joined</p>
              <span className="text-white">{format(new Date(user.created_at), "MMMM d, yyyy")}</span>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Stripe Customer</p>
              <span className="text-muted font-mono text-xs truncate block">
                {subscriptions?.[0]?.stripe_customer_id || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Charity Card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-5 h-5 text-[#ff6b4a]" />
            <h2 className="text-lg font-bold text-white">Charity</h2>
          </div>
          {user.charities ? (
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Supported Charity</p>
                <span className="text-white font-medium">{user.charities.name}</span>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Contribution Split</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#1c1c30] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${user.charity_percentage}%` }}
                    />
                  </div>
                  <span className="text-primary font-bold">{user.charity_percentage}%</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm">User has not selected a charity yet.</p>
          )}
        </div>
        
        {/* Winnings Summary */}
        <div className="bg-surface border border-[#f5c842]/30 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="w-24 h-24 text-[#f5c842]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-5 h-5 text-[#f5c842]" />
              <h2 className="text-lg font-bold text-white">Winnings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#f5c842]/70 mb-1">Total Won</p>
                <span className="text-3xl font-bold text-[#f5c842]">
                  ${winnings?.reduce((sum, w) => sum + Number(w.prize_amount), 0).toLocaleString() || 0}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Draws Won</p>
                <span className="text-white font-medium">{winnings?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scores History */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-white">Recent Scores</h2>
          </div>
          <span className="text-xs text-muted">Showing up to 5 latest scores</span>
        </div>
        
        {scores && scores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {scores.map((score, index) => (
              <div key={score.id} className="bg-[#1c1c30] rounded-lg p-4 flex flex-col items-center justify-center border border-border">
                <span className="text-[10px] uppercase tracking-widest text-muted mb-2">
                  {format(new Date(score.score_date), "MMM d")}
                </span>
                <span className={`text-3xl font-bold ${index === 0 ? "text-primary" : "text-white"}`}>
                  {score.score}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm text-center py-8">No scores recorded yet.</p>
        )}
      </div>
      
    </div>
  );
}
