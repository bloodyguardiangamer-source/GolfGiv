import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", user.id)
    .order("score_date", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ scores: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { score, score_date } = body;

    // Validation
    if (!score || !score_date) {
      return NextResponse.json({ error: "Score and Date are required" }, { status: 400 });
    }

    const numScore = parseInt(score);
    if (isNaN(numScore) || numScore < 1 || numScore > 45) {
      return NextResponse.json({ error: "Score must be between 1 and 45" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("scores")
      .insert([
        {
          user_id: user.id,
          score: numScore,
          score_date,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Postgres Unique Violation
        return NextResponse.json({ error: "A score for this date already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ score: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
