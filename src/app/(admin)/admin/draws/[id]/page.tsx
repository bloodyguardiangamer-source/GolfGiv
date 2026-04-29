import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Trophy, Users, DollarSign, Hash } from "lucide-react";

export const metadata = {
  title: "Draw Details | Admin | GolfGive",
};

export default async function DrawDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: draw, error } = await supabase
    .from("draws")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !draw) {
    notFound();
  }

  // Fetch entries for this draw with user info
  const { data: entries } = await supabase
    .from("draw_entries")
    .select("*, users(full_name, email)")
    .eq("draw_id", draw.id)
    .order("match_count", { ascending: false });

  // Fetch winners for this draw
  const { data: winners } = await supabase
    .from("winners")
    .select("*, users(full_name, email), draw_entries(match_count)")
    .eq("draw_entry_id", entries?.filter(e => e.is_winner).map(e => e.id)?.[0] || "00000000-0000-0000-0000-000000000000");

  // Better: fetch all winners for entries of this draw
  const winnerEntryIds = entries?.filter(e => e.is_winner).map(e => e.id) || [];
  let drawWinners: any[] = [];
  if (winnerEntryIds.length > 0) {
    const { data } = await supabase
      .from("winners")
      .select("*, users(full_name, email)")
      .in("draw_entry_id", winnerEntryIds);
    drawWinners = data || [];
  }

  const totalEntries = entries?.length || 0;
  const totalWinners = entries?.filter(e => e.is_winner).length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/draws" className="p-2 bg-surface border border-border rounded-lg hover:bg-[#1c1c30] transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            {draw.draw_month ? format(new Date(draw.draw_month + 'T00:00:00'), "MMMM yyyy") : "Draw"} Draw
          </h1>
          <p className="text-muted text-sm">
            Status: <span className={`font-bold uppercase ${draw.status === 'published' ? 'text-primary' : 'text-[#f5c842]'}`}>{draw.status}</span>
            {' · '}Mode: <span className="font-bold uppercase text-white">{draw.draw_mode}</span>
          </p>
        </div>
      </div>

      {/* Draw Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <Hash className="w-8 h-8 text-primary" />
          <div>
            <p className="text-2xl font-bold text-white">{totalEntries}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">Total Entries</p>
          </div>
        </div>
        <div className="bg-surface border border-[#f5c842]/30 rounded-xl p-5 flex items-center gap-4">
          <Trophy className="w-8 h-8 text-[#f5c842]" />
          <div>
            <p className="text-2xl font-bold text-[#f5c842]">{totalWinners}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">Winners</p>
          </div>
        </div>
        <div className="bg-surface border border-primary/30 rounded-xl p-5 flex items-center gap-4">
          <DollarSign className="w-8 h-8 text-primary" />
          <div>
            <p className="text-2xl font-bold text-primary">${Number(draw.prize_pool_total || 0).toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">Prize Pool</p>
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
          <DollarSign className="w-8 h-8 text-muted" />
          <div>
            <p className="text-2xl font-bold text-white">${Number(draw.jackpot_rollover || 0).toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">Rollover</p>
          </div>
        </div>
      </div>

      {/* Drawn Numbers */}
      {draw.drawn_numbers && (
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-4">Drawn Numbers</h3>
          <div className="flex items-center gap-3">
            {draw.drawn_numbers.map((n: number, i: number) => (
              <div key={i} className="w-14 h-14 flex items-center justify-center bg-primary text-[#0a0a14] font-bold text-xl rounded-full shadow-lg">
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winners Table */}
      {drawWinners.length > 0 && (
        <div className="bg-surface border border-[#f5c842]/30 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-[#f5c842] flex items-center gap-2">
              <Trophy className="w-5 h-5" /> Winners
            </h3>
          </div>
          <table className="w-full text-left text-sm text-muted">
            <thead className="bg-[#1c1c30] text-[11px] uppercase tracking-[0.12em] font-medium text-muted">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Prize</th>
                <th className="px-6 py-3">Verification</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {drawWinners.map((w) => (
                <tr key={w.id} className="hover:bg-[#1c1c30]/50 transition-colors">
                  <td className="px-6 py-3">
                    <p className="font-medium text-white">{w.users?.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted">{w.users?.email}</p>
                  </td>
                  <td className="px-6 py-3 font-bold text-[#f5c842]">${Number(w.prize_amount).toLocaleString()}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      w.verification_status === 'approved' ? 'bg-primary/20 text-primary' :
                      w.verification_status === 'rejected' ? 'bg-[#ff6b4a]/20 text-[#ff6b4a]' :
                      'bg-muted/20 text-muted'
                    }`}>{w.verification_status}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      w.payment_status === 'paid' ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted'
                    }`}>{w.payment_status}</span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/admin/winners/${w.id}`} className="text-[#f5c842] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* All Entries Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> All Entries ({totalEntries})
          </h3>
        </div>
        {entries && entries.length > 0 ? (
          <table className="w-full text-left text-sm text-muted">
            <thead className="bg-[#1c1c30] text-[11px] uppercase tracking-[0.12em] font-medium text-muted">
              <tr>
                <th className="px-6 py-3">Player</th>
                <th className="px-6 py-3">Scores</th>
                <th className="px-6 py-3">Matches</th>
                <th className="px-6 py-3">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.map((entry) => (
                <tr key={entry.id} className={`hover:bg-[#1c1c30]/50 transition-colors ${entry.is_winner ? 'bg-[#f5c842]/5' : ''}`}>
                  <td className="px-6 py-3">
                    <p className="font-medium text-white">{entry.users?.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted">{entry.users?.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-1.5">
                      {entry.user_scores?.map((s: number, i: number) => (
                        <span key={i} className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1c1c30] text-white text-[11px] font-bold border border-border">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`font-bold text-lg ${
                      entry.match_count >= 5 ? 'text-[#f5c842]' :
                      entry.match_count >= 3 ? 'text-primary' :
                      'text-muted'
                    }`}>{entry.match_count}/5</span>
                  </td>
                  <td className="px-6 py-3">
                    {entry.is_winner ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#f5c842]/20 text-[#f5c842]">
                        <Trophy className="w-3 h-3" /> {entry.prize_tier?.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="text-muted/50 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center text-muted">No entries for this draw.</div>
        )}
      </div>
    </div>
  );
}
