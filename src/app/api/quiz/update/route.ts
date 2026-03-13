import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

export async function PUT(req: NextRequest) {
  const { defaultAnswers, customQuestions } = await req.json();
  const rawUserId = req.cookies.get("user_id")?.value;

  if (!rawUserId || !isValidUUID(rawUserId)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  // 본인 방 조회
  const { data: room } = await supabase
    .from("quiz_rooms")
    .select("id")
    .eq("host_id", rawUserId)
    .single();

  if (!room) {
    return NextResponse.json({ error: "room not found" }, { status: 404 });
  }

  // default_answers 업데이트
  const { error: updateError } = await supabase
    .from("quiz_rooms")
    .update({ default_answers: defaultAnswers ?? [] })
    .eq("id", room.id);

  if (updateError) {
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  // 기존 커스텀 문항 삭제
  const { error: deleteError } = await supabase
    .from("questions")
    .delete()
    .eq("room_id", room.id);

  if (deleteError) {
    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }

  // 새 커스텀 문항 INSERT
  if (customQuestions && customQuestions.length > 0) {
    const questionsToInsert = customQuestions.map(
      (q: { question_text: string; options: string[]; correct_index: number }) => ({
        room_id: room.id,
        question_text: q.question_text,
        options: q.options,
        correct_index: q.correct_index,
      })
    );

    const { error: insertError } = await supabase
      .from("questions")
      .insert(questionsToInsert);

    if (insertError) {
      return NextResponse.json({ error: "insert failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
