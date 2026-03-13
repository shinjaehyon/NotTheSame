import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json(
      { error: "존재하지 않는 퀴즈 코드입니다" },
      { status: 404 }
    );
  }

  const supabase = createClient();

  const { data: room } = await supabase
    .from("quiz_rooms")
    .select("id, access_code")
    .eq("access_code", code.toUpperCase())
    .single();

  if (!room) {
    return NextResponse.json(
      { error: "존재하지 않는 퀴즈 코드입니다" },
      { status: 404 }
    );
  }

  return NextResponse.json({ roomId: room.id, accessCode: room.access_code });
}
