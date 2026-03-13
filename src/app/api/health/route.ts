import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("users").select("count").limit(1);

    if (error) throw error;

    return NextResponse.json({ status: "ok", db: "connected" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", db: "disconnected", message: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
