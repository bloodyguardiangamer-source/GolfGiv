import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { charity_id, charity_percentage } = body;

    const updates: any = {};
    if (charity_id !== undefined) updates.charity_id = charity_id;
    if (charity_percentage !== undefined) {
      const percentage = parseInt(charity_percentage);
      if (isNaN(percentage) || percentage < 10 || percentage > 100) {
        return NextResponse.json({ error: "Percentage must be between 10 and 100" }, { status: 400 });
      }
      updates.charity_percentage = percentage;
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
