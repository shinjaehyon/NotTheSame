import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";
import { DEFAULT_QUESTIONS } from "@/lib/questions";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const supabase = createClient();
  const rawUserId = req.cookies.get("user_id")?.value;

  // room 조회
  const { data: room } = await supabase
    .from("quiz_rooms")
    .select("id")
    .eq("access_code", params.code.toUpperCase())
    .single();

  if (!room) {
    return NextResponse.json({ error: "room not found" }, { status: 404 });
  }

  // 전체 문항 수 = 기본 10 + DB 커스텀 문항 수
  const { count: customCount } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("room_id", room.id);

  const totalCount = DEFAULT_QUESTIONS.length + (customCount ?? 0);

  // 랭킹 조회 (score 내림차순)
  const { data: responses } = await supabase
    .from("responses")
    .select("guest_id, score")
    .eq("room_id", room.id)
    .order("score", { ascending: false });

  if (!responses || responses.length === 0) {
    return NextResponse.json({
      rankings: [],
      myScore: null,
      myCorrectCount: null,
      myTotalCount: totalCount,
      myGuestId: null,
    });
  }

  // users 닉네임 일괄 조회
  const guestIds = responses.map((r) => r.guest_id);
  const { data: users } = await supabase
    .from("users")
    .select("id, nickname")
    .in("id", guestIds);

  const nicknameMap: Record<string, string> = {};
  for (const u of users ?? []) {
    nicknameMap[u.id] = u.nickname;
  }

  // 랭킹 생성
  const rankings = responses.map((r, i) => ({
    rank: i + 1,
    nickname: nicknameMap[r.guest_id] ?? "알 수 없음",
    score: r.score,
    guestId: r.guest_id,
  }));

  // 본인 데이터
  const myGuestId =
    rawUserId && isValidUUID(rawUserId) ? rawUserId : null;
  const myResponse = myGuestId
    ? responses.find((r) => r.guest_id === myGuestId)
    : null;
  const myScore = myResponse?.score ?? null;
  const myCorrectCount =
    myScore !== null
      ? Math.round((myScore * totalCount) / 100)
      : null;

  return NextResponse.json({
    rankings,
    myScore,
    myCorrectCount,
    myTotalCount: totalCount,
    myGuestId,
  });
}
