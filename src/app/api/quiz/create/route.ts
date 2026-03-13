import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

function generateAccessCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  const { defaultAnswers, customQuestions } = await req.json();

  const rawUserId = req.cookies.get("user_id")?.value;
  const supabase = createClient();

  let userId: string;

  if (rawUserId && isValidUUID(rawUserId)) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("id", rawUserId)
      .single();

    if (existing) {
      userId = existing.id;
    } else {
      const { data, error } = await supabase
        .from("users")
        .upsert({ id: rawUserId, nickname: "호스트" })
        .select("id")
        .single();
      if (error || !data) {
        return NextResponse.json({ error: "user upsert failed" }, { status: 500 });
      }
      userId = data.id;
    }
  } else {
    const { data, error } = await supabase
      .from("users")
      .insert({ nickname: "호스트" })
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "user insert failed" }, { status: 500 });
    }
    userId = data.id;
  }

  // 기존 방 확인 (1인 1방 제한)
  const { data: existingRoom } = await supabase
    .from("quiz_rooms")
    .select("access_code")
    .eq("host_id", userId)
    .single();

  if (existingRoom) {
    return NextResponse.json(
      { error: "room_exists", accessCode: existingRoom.access_code },
      { status: 409 }
    );
  }

  // 중복 없는 접속 코드 생성
  let accessCode = "";
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = generateAccessCode();
    const { data: existing } = await supabase
      .from("quiz_rooms")
      .select("id")
      .eq("access_code", candidate)
      .single();
    if (!existing) {
      accessCode = candidate;
      break;
    }
  }

  if (!accessCode) {
    return NextResponse.json({ error: "code generation failed" }, { status: 500 });
  }

  const { data: room, error: roomError } = await supabase
    .from("quiz_rooms")
    .insert({
      access_code: accessCode,
      host_id: userId,
      default_answers: defaultAnswers ?? [],
    })
    .select("id")
    .single();

  if (roomError || !room) {
    return NextResponse.json({ error: "room insert failed" }, { status: 500 });
  }

  // 커스텀 문항만 DB에 저장
  if (customQuestions && customQuestions.length > 0) {
    const questionsToInsert = customQuestions.map(
      (q: { question_text: string; options: string[]; correct_index: number }) => ({
        room_id: room.id,
        question_text: q.question_text,
        options: q.options,
        correct_index: q.correct_index,
      })
    );

    const { error: questionsError } = await supabase
      .from("questions")
      .insert(questionsToInsert);

    if (questionsError) {
      return NextResponse.json({ error: "questions insert failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ accessCode });
}
