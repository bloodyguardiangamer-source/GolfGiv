import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateEntries } from "@/lib/draw-engine/matcher";
import { calculatePrizePool } from "@/lib/draw-engine/prize";
import { sendDrawResultsEmail, sendWinnerAlertEmail } from "@/lib/emails/resend";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { drawNumbers, customPrizePool, prizeSplit } = body;

    if (!drawNumbers || !Array.isArray(drawNumbers) || drawNumbers.length !== 5) {
      return NextResponse.json({ error: "Invalid draw numbers provided" }, { status: 400 });
    }

    // Validate each number is 1-45 and unique
    const uniqueNums = new Set(drawNumbers);
    if (uniqueNums.size !== 5 || drawNumbers.some((n: number) => n < 1 || n > 45)) {
      return NextResponse.json({ error: "Draw numbers must be 5 unique integers between 1 and 45" }, { status: 400 });
    }

    // 1. Fetch scores with user info
    const { data: scoresData, error: scoresError } = await supabase
      .from("scores")
      .select("*, users(email, full_name)")
      .order("score_date", { ascending: false });
    if (scoresError) throw scoresError;

    // 2. Group by user — take latest 5 scores per user
    const userScoresMap = new Map<string, { scores: number[], email: string, name: string }>();
    scoresData?.forEach(s => {
      if (!userScoresMap.has(s.user_id)) {
        userScoresMap.set(s.user_id, {
          scores: [],
          email: s.users?.email || '',
          name: s.users?.full_name?.split(' ')[0] || 'Member'
        });
      }
      const userData = userScoresMap.get(s.user_id)!;
      if (userData.scores.length < 5) {
        userData.scores.push(s.score);
      }
    });

    const validEntries: { userId: string, scores: number[], email: string, name: string }[] = [];
    userScoresMap.forEach((data, userId) => {
      if (data.scores.length === 5) validEntries.push({ userId, ...data });
    });

    // 3. Evaluate matches
    const { results, matchCounts } = evaluateEntries(validEntries, drawNumbers);

    // 4. Calculate Prizes — support manual override
    let prizeDistribution: any;
    
    if (customPrizePool && prizeSplit) {
      // Admin-defined prize pool with custom split
      const totalPool = Number(customPrizePool);
      const jackpotPool = (totalPool * (prizeSplit.jackpot || 50)) / 100;
      const fourMatchPool = (totalPool * (prizeSplit.fourMatch || 30)) / 100;
      const threeMatchPool = (totalPool * (prizeSplit.threeMatch || 20)) / 100;
      
      prizeDistribution = {
        totalPool,
        totalRevenue: totalPool,
        newRollover: matchCounts.five === 0 ? jackpotPool : 0,
        prizes: {
          match5: {
            pool: jackpotPool,
            count: matchCounts.five,
            perWinner: matchCounts.five > 0 ? Math.round(jackpotPool / matchCounts.five) : 0,
          },
          match4: {
            pool: fourMatchPool,
            count: matchCounts.four,
            perWinner: matchCounts.four > 0 ? Math.round(fourMatchPool / matchCounts.four) : 0,
          },
          match3: {
            pool: threeMatchPool,
            count: matchCounts.three,
            perWinner: matchCounts.three > 0 ? Math.round(threeMatchPool / matchCounts.three) : 0,
          },
        },
      };
    } else {
      // Auto: calculate from subscription revenue
      const totalRevenue = validEntries.length * 10;
      const { data: lastDraw } = await supabase
        .from("draws")
        .select("jackpot_rollover")
        .order("draw_month", { ascending: false })
        .limit(1)
        .single();
      const rollover = Number(lastDraw?.jackpot_rollover) || 0;
      prizeDistribution = calculatePrizePool(totalRevenue, rollover, matchCounts);
    }

    // 5. DB WRITE: Create Draw using correct schema columns
    // Construct draw_month as exactly YYYY-MM-01 (first day of current month, UTC)
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const drawMonth = `${year}-${month}-01`;
    
    // Check if a draw already exists for this month
    const { data: existingDraw } = await supabase
      .from("draws")
      .select("id")
      .eq("draw_month", drawMonth)
      .single();

    let newDraw;
    
    if (existingDraw) {
      // Update existing draw (e.g. re-publishing after a simulation)
      const { data, error: drawError } = await supabase.from("draws").update({
        draw_mode: "random",
        drawn_numbers: drawNumbers,
        status: "published",
        prize_pool_total: prizeDistribution.totalRevenue || 0,
        jackpot_rollover: prizeDistribution.newRollover || 0,
        published_at: new Date().toISOString(),
      }).eq("id", existingDraw.id).select().single();
      
      if (drawError) throw drawError;
      newDraw = data;
    } else {
      // Create new draw
      const { data, error: drawError } = await supabase.from("draws").insert({
        draw_month: drawMonth,
        draw_mode: "random",
        drawn_numbers: drawNumbers,
        status: "published",
        prize_pool_total: prizeDistribution.totalRevenue || 0,
        jackpot_rollover: prizeDistribution.newRollover || 0,
        published_at: new Date().toISOString(),
      }).select().single();

      if (drawError) throw drawError;
      newDraw = data;
    }
    
    // Clean up any existing entries for this draw (in case of re-publish)
    await supabase.from("draw_entries").delete().eq("draw_id", newDraw.id);

    // 6. DB WRITE: Create Draw Entries using correct schema columns
    const entriesToInsert = results.map(r => {
      let prizeTier: string | null = null;
      let isWinner = false;
      if (r.matches >= 3) {
        isWinner = true;
        if (r.matches === 3) prizeTier = 'three_match';
        else if (r.matches === 4) prizeTier = 'four_match';
        else if (r.matches === 5) prizeTier = 'five_match';
      }

      return {
        draw_id: newDraw.id,
        user_id: r.userId,
        user_scores: r.scores,
        match_count: r.matches,
        is_winner: isWinner,
        prize_tier: prizeTier,
      };
    });

    let insertedEntries: any[] = [];
    if (entriesToInsert.length > 0) {
      const { data, error: entriesError } = await supabase.from("draw_entries").insert(entriesToInsert).select();
      if (entriesError) throw entriesError;
      insertedEntries = data || [];
    }

    // 7. DB WRITE: Create Winner records for 3+ matches
    const winnersToInsert = results
      .filter(r => r.matches >= 3)
      .map(r => {
        const entry = insertedEntries.find(e => e.user_id === r.userId);
        let prizeAmount = 0;
        if (r.matches === 5) prizeAmount = prizeDistribution.prizes.match5.perWinner;
        else if (r.matches === 4) prizeAmount = prizeDistribution.prizes.match4.perWinner;
        else if (r.matches === 3) prizeAmount = prizeDistribution.prizes.match3.perWinner;

        return {
          draw_entry_id: entry?.id,
          user_id: r.userId,
          prize_amount: prizeAmount,
        };
      })
      .filter(w => w.draw_entry_id); // Only insert if we have a valid entry ID

    if (winnersToInsert.length > 0) {
      await supabase.from("winners").insert(winnersToInsert);
    }

    // 8. FIRE EMAILS (Async, fire-and-forget for performance)
    if (process.env.RESEND_API_KEY) {
      const drawDateString = drawMonth;
      results.forEach(r => {
        const entry = insertedEntries.find(e => e.user_id === r.userId);
        let prizeWon = 0;
        if (r.matches === 5) prizeWon = prizeDistribution.prizes.match5.perWinner;
        else if (r.matches === 4) prizeWon = prizeDistribution.prizes.match4.perWinner;
        else if (r.matches === 3) prizeWon = prizeDistribution.prizes.match3.perWinner;

        sendDrawResultsEmail(r.email as string, r.name as string, drawDateString, drawNumbers, r.matches, prizeWon);

        if (prizeWon > 0 && entry?.id) {
          sendWinnerAlertEmail(r.email as string, r.name as string, prizeWon, entry.id);
        }
      });
    }

    return NextResponse.json({ success: true, drawId: newDraw.id, prizeDistribution });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Failed to publish draw" }, { status: 500 });
  }
}
