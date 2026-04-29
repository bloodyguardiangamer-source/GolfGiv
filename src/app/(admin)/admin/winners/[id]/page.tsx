import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle, XCircle, DollarSign, ExternalLink, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Review Winner | Admin | GolfGive",
};

export default async function ReviewWinnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: winnerId } = await params;
  const supabase = await createClient();

  const { data: winner, error } = await supabase
    .from("winners")
    .select("*, users(full_name, email), draw_entries(match_count, draws(draw_month))")
    .eq("id", winnerId)
    .single();

  if (error || !winner) {
    notFound();
  }

  // Handle server actions for status updates
  const handleUpdate = async (formData: FormData) => {
    "use server";
    const supabaseServer = await createClient();
    const action = formData.get("action") as string;
    
    if (action === "approve") {
      await supabaseServer
        .from("winners")
        .update({ verification_status: "approved", payment_status: "paid" })
        .eq("id", winnerId);
    } else if (action === "reject") {
      await supabaseServer
        .from("winners")
        .update({ verification_status: "rejected" })
        .eq("id", winnerId);
    }
    
    revalidatePath(`/admin/winners/${winnerId}`);
    revalidatePath("/admin/winners");
    redirect("/admin/winners");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/winners" className="p-2 bg-surface border border-border rounded-lg hover:bg-[#1c1c30] transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Review Winner</h1>
          <p className="text-muted">Verify the player's scorecard proof and issue payout.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player Details */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-6">Player Details</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted mb-1">Full Name</div>
              <div className="text-white font-medium">{winner.users?.full_name}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Email Address</div>
              <div className="text-white">{winner.users?.email}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Winning Draw Month</div>
              <div className="text-white">
                {winner.draw_entries?.draws?.draw_month 
                  ? format(new Date(winner.draw_entries.draws.draw_month), "MMMM yyyy") 
                  : "Unknown"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Matched Numbers</div>
              <div className="text-[#f5c842] font-bold text-xl">{winner.draw_entries?.match_count} / 5</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Prize Amount</div>
              <div className="text-primary font-bold text-3xl tracking-tight">
                ${Number(winner.prize_amount).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-surface border border-border rounded-xl p-6 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted mb-6">Verification Proof</h3>
          
          <div className="flex-grow">
            {winner.proof_url ? (
              <div className="space-y-4">
                <div className="p-4 bg-[#1c1c30] rounded-lg border border-[#2c2c48]">
                  <div className="flex items-center gap-3 text-white mb-4">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span className="font-medium">Proof Uploaded</span>
                  </div>
                  <a 
                    href={winner.proof_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#2c2c48] hover:bg-[#3d3d5c] text-white rounded-md text-sm font-medium transition-colors"
                  >
                    View Document / Image <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-dashed border-[#ff6b4a]/30 bg-[#ff6b4a]/5 rounded-lg flex flex-col items-center justify-center text-center h-full">
                <ShieldAlert className="w-8 h-8 text-[#ff6b4a] mb-3" />
                <p className="text-[#ff6b4a] font-medium text-sm">No Proof Uploaded</p>
                <p className="text-xs text-muted mt-2">The user has not uploaded their official scorecard verification yet.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="mb-4">
              <span className="text-xs text-muted mr-3">Current Status:</span>
              <span className="text-white font-bold uppercase tracking-wider text-sm">{winner.verification_status}</span>
            </div>

            {winner.verification_status === 'pending' && (
              <form action={handleUpdate} className="flex gap-4">
                <button
                  type="submit"
                  name="action"
                  value="reject"
                  className="flex-1 py-3 bg-transparent border border-[#ff6b4a] text-[#ff6b4a] hover:bg-[#ff6b4a]/10 rounded-md font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  type="submit"
                  name="action"
                  value="approve"
                  disabled={!winner.proof_url}
                  className="flex-[2] py-3 bg-primary text-black hover:bg-primary-deep disabled:opacity-50 disabled:cursor-not-allowed rounded-md font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" /> Approve & Mark Paid
                </button>
              </form>
            )}
            
            {winner.verification_status === 'approved' && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-primary text-sm font-medium flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> This winner has been approved and paid.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
