import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");

  let query = supabase.from("charities").select("*").eq("is_active", true);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query.order("is_featured", { ascending: false }).order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ charities: data });
}
