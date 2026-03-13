import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID } from "@/lib/utils";

export default async function Home({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  // 기존 방 확인
  const cookieStore = cookies();
  const rawUserId = cookieStore.get("user_id")?.value;

  let existingRoomCode: string | null = null;

  if (rawUserId && isValidUUID(rawUserId)) {
    const supabase = createClient();
    const { data: room } = await supabase
      .from("quiz_rooms")
      .select("access_code")
      .eq("host_id", rawUserId)
      .single();

    if (room) {
      existingRoomCode = room.access_code;
    }
  }

  const header = (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">상호이해도 게임</h1>
      <p className="text-sm text-muted-foreground">
        친구가 나를 얼마나 아는지 확인해보세요
      </p>
    </div>
  );

  // 방이 있으면: 내 답변 보기 + 참여하기
  if (existingRoomCode) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8 text-center">
          {header}
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full" data-testid="my-room-btn">
              <Link href={`/quiz/create?edit=${existingRoomCode}`}>내 답변 보기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href="/quiz/join">참여하기</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // 방 없음: 닉네임 폼 + 방 만들기 + 참여하기
  const errorMessage =
    searchParams.error === "nickname"
      ? "닉네임을 입력해주세요"
      : searchParams.error === "server"
        ? "오류가 발생했습니다. 다시 시도해주세요."
        : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        {header}

        <form
          action="/api/auth/register"
          method="POST"
          className="space-y-3"
        >
          <Input name="nickname" placeholder="닉네임을 입력하세요" />
          {errorMessage && (
            <p className="text-sm text-destructive text-left">{errorMessage}</p>
          )}
          <Button
            type="submit"
            name="intent"
            value="host"
            size="lg"
            className="w-full"
          >
            방 만들기
          </Button>
        </form>

        <Button asChild size="lg" variant="outline" className="w-full">
          <Link href="/quiz/join" role="button">참여하기</Link>
        </Button>
      </div>
    </main>
  );
}
