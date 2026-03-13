import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const rawUserId = req.cookies.get("user_id")?.value;

  if (!rawUserId || !isValidUUID(rawUserId)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  // 방 조회 + 호스트 확인
  const { data: room } = await supabase
    .from("quiz_rooms")
    .select("id, access_code, default_answers, host_id")
    .eq("access_code", params.code.toUpperCase())
    .single();

  if (!room) {
    return NextResponse.json({ error: "room not found" }, { status: 404 });
  }

  if (room.host_id !== rawUserId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // 커스텀 문항 조회 (correct_index 포함)
  const { data: customQuestions, error } = await supabase
    .from("questions")
    .select("id, question_text, options, correct_index")
    .eq("room_id", room.id);

  if (error) {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  return NextResponse.json({
    defaultAnswers: room.default_answers ?? [],
    customQuestions: customQuestions ?? [],
    accessCode: room.access_code,
  });
}
