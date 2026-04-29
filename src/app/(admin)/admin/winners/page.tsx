import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { Trophy, CheckCircle, XCircle, DollarSign, Clock } from "lucide-react";

export const metadata = {
  title: "Manage Winners | Admin | GolfGive",
};

export default async function AdminWinnersPage() {
  const supabase = await createClient();

  const { data: winners } = await supabase
    .from("winners")
    .select("*, users(full_name, email), draw_entries(match_count, draws(draw_month))")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Winners</h1>
        <p className="text-muted">Verify claims, approve proofs, and manage payouts.</p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted">
            <thead className="bg-[#1c1c30] text-[11px] uppercase tracking-[0.12em] font-medium text-muted">
              <tr>
                <th className="px-6 py-4">Winner</th>
                <th className="px-6 py-4">Draw</th>
                <th className="px-6 py-4">Prize</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Payout</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {winners?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    No winners recorded yet.
                  </td>
                </tr>
              ) : (
                winners?.map((winner) => (
                  <tr key={winner.id} className="hover:bg-[#1c1c30]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{winner.users?.full_name}</div>
                      <div className="text-xs text-muted">{winner.users?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">
                        {winner.draw_entries?.draws?.draw_month ? format(new Date(winner.draw_entries.draws.draw_month), "MMM yyyy") : 'Unknown'}
                      </div>
                      <div className="text-xs text-[#f5c842]">{winner.draw_entries?.match_count} Matches</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#f5c842]">
                      ${Number(winner.prize_amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {winner.verification_status === "pending" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-muted/20 text-muted">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      ) : winner.verification_status === "approved" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-[#ff6b4a]/20 text-[#ff6b4a]">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {winner.payment_status === "paid" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary">
                          <DollarSign className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-muted/20 text-muted">
                          <Clock className="w-3 h-3" /> Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/winners/${winner.id}`}
                        className="text-[#f5c842] hover:text-white font-medium transition-colors"
                      >
                        Review &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
