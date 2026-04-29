import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { Ticket, Plus } from "lucide-react";

export const metadata = {
  title: "Manage Draws | Admin | GolfGive",
};

export default async function AdminDrawsPage() {
  const supabase = await createClient();

  const { data: draws } = await supabase
    .from("draws")
    .select("*")
    .order("draw_month", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Draws</h1>
          <p className="text-muted">Manage monthly prize draws and modes.</p>
        </div>
        <Link
          href="/admin/draws/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-deep text-[#0a0a14] px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Configure New Draw
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted">
            <thead className="bg-[#1c1c30] text-[11px] uppercase tracking-[0.12em] font-medium text-muted">
              <tr>
                <th className="px-6 py-4">Month</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Prize Pool</th>
                <th className="px-6 py-4">Drawn Numbers</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {draws?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    No draws have been created yet.
                  </td>
                </tr>
              ) : (
                draws?.map((draw) => (
                  <tr key={draw.id} className="hover:bg-[#1c1c30]/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {format(new Date(draw.draw_month + 'T00:00:00'), "MMMM yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest ${
                          draw.status === "published"
                            ? "bg-primary/20 text-primary"
                            : draw.status === "simulation"
                            ? "bg-[#5ba3ff]/20 text-[#5ba3ff]"
                            : "bg-[#f5c842]/20 text-[#f5c842]"
                        }`}
                      >
                        {draw.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 uppercase text-[11px] tracking-wider font-semibold">
                      {draw.draw_mode}
                      {draw.draw_mode === 'algorithmic' && draw.favor_least_common && (
                        <span className="block text-[9px] text-[#ff6b4a]">Favors Least Common</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#f5c842] font-semibold">
                      ${Number(draw.prize_pool_total || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {draw.drawn_numbers ? (
                        <div className="flex gap-1.5">
                          {draw.drawn_numbers.map((n: number, i: number) => (
                            <span key={i} className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1c1c30] text-white text-xs font-bold border border-border">
                              {n}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted/50">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {draw.status === 'scheduled' || draw.status === 'simulation' ? (
                        <Link 
                          href={`/admin/draws/${draw.id}`}
                          className="text-primary hover:text-primary-deep font-medium transition-colors"
                        >
                          Simulate & Publish &rarr;
                        </Link>
                      ) : (
                        <Link 
                          href={`/admin/draws/${draw.id}`}
                          className="text-muted hover:text-white font-medium transition-colors"
                        >
                          View Results
                        </Link>
                      )}
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
