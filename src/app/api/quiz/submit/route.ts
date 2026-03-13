import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(req: NextRequest) {
  const { roomCode, answers } = await req.json();
  const rawUserId = req.cookies.get("user_id")?.value;

  const supabase = createClient();

  // guest_id 확보
  let guestId: string;

  if (rawUserId && isValidUUID(rawUserId)) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", rawUserId)
      .single();

    if (existing) {
      guestId = existing.id;
    } else {
      const { data, error } = await supabase
        .from("users")
        .upsert({ id: rawUserId, nickname: "게스트" })
        .select("id")
        .single();
      if (error || !data) {
        return NextResponse.json({ error: "user upsert failed" }, { status: 500 });
      }
      guestId = data.id;
    }
  } else {
    const { data, error } = await supabase
      .from("users")
      .insert({ nickname: "게스트" })
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "user insert failed" }, { status: 500 });
    }
    guestId = data.id;
  }

  // room 조회
  const { data: room } = await supabase
    .from("quiz_rooms")
    .select("id")
    .eq("access_code", roomCode.toUpperCase())
    .single();

  if (!room) {
    return NextResponse.json({ error: "room not found" }, { status: 404 });
  }

  // questions + correct_index 조회 (서버에서만)
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, correct_index")
    .eq("room_id", room.id);

  if (questionsError || !questions) {
    return NextResponse.json({ error: "questions fetch failed" }, { status: 500 });
  }

  // 점수 계산
  let correctCount = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct_index) correctCount++;
  }
  const score = questions.length > 0
    ? Math.round((correctCount / questions.length) * 100)
    : 0;

  // responses INSERT
  const { error: responseError } = await supabase.from("responses").insert({
    room_id: room.id,
    guest_id: guestId,
    score,
  });

  if (responseError) {
    return NextResponse.json({ error: "response insert failed" }, { status: 500 });
  }

  return NextResponse.json({ score, correctCount, totalCount: questions.length });
}
