import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { score, score_date } = body;

    const updates: any = {};
    if (score !== undefined) {
      const numScore = parseInt(score);
      if (isNaN(numScore) || numScore < 1 || numScore > 45) {
        return NextResponse.json({ error: "Score must be between 1 and 45" }, { status: 400 });
      }
      updates.score = numScore;
    }
    if (score_date !== undefined) updates.score_date = score_date;

    const { data, error } = await supabase
      .from("scores")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id) // Security check
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: "A score for this date already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ score: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const { error } = await supabase
      .from("scores")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Security check

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
