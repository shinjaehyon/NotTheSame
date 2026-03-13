import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_QUESTIONS } from "@/lib/questions";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const supabase = createClient();

  const { data: room } = await supabase
    .from("quiz_rooms")
    .select("id")
    .eq("access_code", params.code.toUpperCase())
    .single();

  if (!room) {
    return NextResponse.json({ error: "room not found" }, { status: 404 });
  }

  const { data: customQuestions, error } = await supabase
    .from("questions")
    .select("id, question_text, options")
    .eq("room_id", room.id);

  if (error) {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }

  // 기본 문항에 가상 ID 부여 (correct_index 제외)
  const defaultQs = DEFAULT_QUESTIONS.map((q, i) => ({
    id: `default-${i}`,
    question_text: q.question_text,
    options: q.options,
  }));

  const questions = [...defaultQs, ...(customQuestions ?? [])];

  return NextResponse.json({ questions });
}
