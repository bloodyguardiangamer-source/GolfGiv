import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Get the most recent published draw (schema: status = 'published', column: draw_month, drawn_numbers)
  const { data: draw, error: drawError } = await supabase
    .from("draws")
    .select("*")
    .eq("status", "published")
    .order("draw_month", { ascending: false })
    .limit(1)
    .single();

  if (drawError || !draw) {
    return NextResponse.json({ draw: null });
  }

  // 2. Get the user's entry for this specific draw
  const { data: entry } = await supabase
    .from("draw_entries")
    .select("match_count, prize_tier, user_scores, is_winner")
    .eq("draw_id", draw.id)
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({
    draw: {
      id: draw.id,
      draw_date: draw.draw_month,
      numbers: draw.drawn_numbers || [],
      entry: entry ? {
        matches: entry.match_count,
        prize_won: entry.is_winner ? 1 : 0, // actual prize amounts from winners table
        scores: entry.user_scores || []
      } : null
    }
  });
}
