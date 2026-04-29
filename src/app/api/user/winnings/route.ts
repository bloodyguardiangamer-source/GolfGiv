import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch from winners table (correct schema) joined with draw_entries and draws
  const { data: winnings, error } = await supabase
    .from("winners")
    .select(`
      id,
      prize_amount,
      verification_status,
      payment_status,
      proof_url,
      draw_entries (
        match_count,
        prize_tier,
        draws ( draw_month )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ winnings });
}
