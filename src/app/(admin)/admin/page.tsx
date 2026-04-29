import { createClient } from "@/lib/supabase/server";
import { Users, Ticket, Heart, Trophy, AlertCircle, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export const metadata = {
  title: "Admin Overview | GolfGive",
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Fetch metrics
  const { count: totalUsers } = await supabase.from("users").select("*", { count: 'exact', head: true });
  
  const { data: draws } = await supabase.from("draws").select("*").order("draw_month", { ascending: false });
  const { count: totalCharities } = await supabase.from("charities").select("*", { count: 'exact', head: true });
  
  const { data: winners } = await supabase.from("winners").select("*, draw_entries(*)");
  
  const totalPrizePool = draws?.reduce((sum, d) => sum + Number(d.prize_pool_total || 0), 0) || 0;
  const pendingWinners = winners?.filter(w => w.verification_status === 'pending') || [];

  // Fetch recent users
  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, full_name, email, role, subscription_status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch admin count
  const { count: adminCount } = await supabase.from("users").select("*", { count: 'exact', head: true }).eq("role", "admin");

  // Fetch active subscribers count
  const { count: activeSubCount } = await supabase.from("users").select("*", { count: 'exact', head: true }).eq("subscription_status", "active");
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Platform Overview</h1>
        <p className="text-muted">Real-time metrics, recent activity, and system status.</p>
      </div>

      {pendingWinners.length > 0 && (
        <div className="bg-[#f5c842]/10 border border-[#f5c842]/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[#f5c842]">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">You have {pendingWinners.length} winner verification(s) pending.</span>
          </div>
          <Link 
            href="/admin/winners"
            className="text-sm font-bold uppercase tracking-widest text-[#f5c842] hover:text-white transition-colors"
          >
            Review Now &rarr;
          </Link>
        </div>
      )}

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users className="w-24 h-24 text-white" />
          </div>
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-2">Total Users</p>
          <div className="text-[52px] font-bold text-primary tracking-[-2px] leading-none mb-1">
            {totalUsers || 0}
          </div>
          <p className="text-xs text-muted mt-2">{adminCount || 0} admins · {activeSubCount || 0} active subs</p>
          <div className="text-sm text-muted mt-4">
            <Link href="/admin/users" className="text-primary hover:text-primary-deep transition-colors text-xs font-bold uppercase tracking-wider">
              Manage Users &rarr;
            </Link>
          </div>
        </div>

        {/* Prize Pool */}
        <div className="bg-surface border border-[#f5c842]/40 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Trophy className="w-24 h-24 text-[#f5c842]" />
          </div>
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#f5c842]/70 mb-2">Total Prize Pool Generated</p>
          <div className="text-[52px] font-bold text-[#f5c842] tracking-[-2px] leading-none mb-1">
            ${totalPrizePool.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted mt-2">{winners?.length || 0} total winners</p>
          <div className="text-sm text-muted mt-4">
            <Link href="/admin/draws" className="text-[#f5c842] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
              View Draws &rarr;
            </Link>
          </div>
        </div>

        {/* Total Charities */}
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Heart className="w-24 h-24 text-white" />
          </div>
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-2">Active Charities</p>
          <div className="text-[52px] font-bold text-primary tracking-[-2px] leading-none mb-1">
            {totalCharities || 0}
          </div>
          <div className="text-sm text-muted mt-4">
            <Link href="/admin/charities" className="text-primary hover:text-primary-deep transition-colors text-xs font-bold uppercase tracking-wider">
              Manage Charities &rarr;
            </Link>
          </div>
        </div>

        {/* Total Draws */}
        <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Ticket className="w-24 h-24 text-white" />
          </div>
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-2">Total Draws</p>
          <div className="text-[52px] font-bold text-primary tracking-[-2px] leading-none mb-1">
            {draws?.length || 0}
          </div>
          <p className="text-xs text-muted mt-2">
            {draws && draws.length > 0 
              ? `Latest: ${format(new Date(draws[0].draw_month), "MMM yyyy")}` 
              : "No draws yet"}
          </p>
          <div className="text-sm text-muted mt-4">
            <Link href="/admin/draws" className="text-primary hover:text-primary-deep transition-colors text-xs font-bold uppercase tracking-wider">
              Configure Draws &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-white">Recent Users</h2>
            </div>
            <Link href="/admin/users" className="text-xs font-bold uppercase tracking-wider text-primary hover:text-white transition-colors">
              View All &rarr;
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentUsers?.map((user) => (
              <Link 
                key={user.id} 
                href={`/admin/users/${user.id}`}
                className="flex items-center justify-between p-3 bg-[#1c1c30] rounded-md border border-border hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {user.full_name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{user.full_name || "Unknown"}</p>
                    <p className="text-[11px] text-muted">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                    user.role === 'admin' 
                      ? 'bg-[#f5c842]/10 text-[#f5c842]' 
                      : 'bg-muted/10 text-muted'
                  }`}>
                    {user.role}
                  </span>
                  <p className="text-[10px] text-muted mt-1">
                    {format(new Date(user.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </Link>
            ))}
            {(!recentUsers || recentUsers.length === 0) && (
              <p className="text-muted text-sm text-center py-4">No users registered yet.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            <Link 
              href="/admin/draws/new"
              className="flex items-center gap-4 p-4 bg-[#1c1c30] rounded-lg border border-border hover:border-primary/30 transition-all group"
            >
              <div className="p-2 rounded-md bg-primary text-[#0a0a14]">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold group-hover:text-primary transition-colors">Run New Draw</p>
                <p className="text-xs text-muted">Simulate numbers and publish results</p>
              </div>
            </Link>

            <Link 
              href="/admin/charities/new"
              className="flex items-center gap-4 p-4 bg-[#1c1c30] rounded-lg border border-border hover:border-primary/30 transition-all group"
            >
              <div className="p-2 rounded-md bg-[#ff6b4a] text-white">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold group-hover:text-primary transition-colors">Add Charity Partner</p>
                <p className="text-xs text-muted">Register a new organization</p>
              </div>
            </Link>

            <Link 
              href="/admin/winners"
              className="flex items-center gap-4 p-4 bg-[#1c1c30] rounded-lg border border-border hover:border-[#f5c842]/30 transition-all group"
            >
              <div className="p-2 rounded-md bg-[#f5c842] text-[#0a0a14]">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold group-hover:text-[#f5c842] transition-colors">Review Winners</p>
                <p className="text-xs text-muted">{pendingWinners.length} pending verification{pendingWinners.length !== 1 ? 's' : ''}</p>
              </div>
            </Link>

            <Link 
              href="/admin/users"
              className="flex items-center gap-4 p-4 bg-[#1c1c30] rounded-lg border border-border hover:border-primary/30 transition-all group"
            >
              <div className="p-2 rounded-md bg-[#5ba3ff] text-white">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white font-bold group-hover:text-primary transition-colors">Manage Users & Roles</p>
                <p className="text-xs text-muted">Search, promote, or edit user accounts</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
