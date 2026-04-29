import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { drawRandomNumbers } from "@/lib/draw-engine/random";
import { evaluateEntries } from "@/lib/draw-engine/matcher";
import { calculatePrizePool } from "@/lib/draw-engine/prize";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 1. Fetch all scores for the current period
  const { data: scoresData, error } = await supabase
    .from("scores")
    .select("*")
    .order("score_date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 2. Group by user — take latest 5 scores per user
  const userScoresMap = new Map<string, number[]>();
  scoresData?.forEach(s => {
    if (!userScoresMap.has(s.user_id)) {
      userScoresMap.set(s.user_id, []);
    }
    const scores = userScoresMap.get(s.user_id)!;
    if (scores.length < 5) {
      scores.push(s.score);
    }
  });

  const validEntries: { userId: string, scores: number[] }[] = [];
  userScoresMap.forEach((scores, userId) => {
    if (scores.length === 5) {
      validEntries.push({ userId, scores });
    }
  });

  // 3. Draw numbers
  const drawNumbers = drawRandomNumbers();

  // 4. Evaluate
  const { results, matchCounts } = evaluateEntries(validEntries, drawNumbers);

  // 5. Calculate Prize Pool ($10 per valid entry)
  const totalRevenue = validEntries.length * 10;

  // Fetch previous rollover from last draw
  const { data: lastDraw } = await supabase
    .from("draws")
    .select("jackpot_rollover")
    .order("draw_month", { ascending: false })
    .limit(1)
    .single();

  const rollover = Number(lastDraw?.jackpot_rollover) || 0;
  const prizeDistribution = calculatePrizePool(totalRevenue, rollover, matchCounts);

  return NextResponse.json({
    drawNumbers,
    totalEntries: validEntries.length,
    matchCounts,
    prizeDistribution,
    previewResultsCount: results.length
  });
}
