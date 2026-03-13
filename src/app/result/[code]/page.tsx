"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface RankingEntry {
  rank: number;
  nickname: string;
  score: number;
  guestId: string;
}

interface ResultData {
  rankings: RankingEntry[];
  myScore: number | null;
  myCorrectCount: number | null;
  myTotalCount: number;
  myGuestId: string | null;
}

export default function ResultPage({
  params,
}: {
  params: { code: string };
}) {
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchResult() {
    const res = await fetch(`/api/result/${params.code}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchResult();

    // Supabase Realtime 구독
    const supabase = createClient();
    const channel = supabase
      .channel(`result-${params.code}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "responses" },
        () => {
          fetchResult();
        }
      )
      .subscribe();

    // Realtime 미지원 환경 대비 3초 폴링 fallback
    const interval = setInterval(fetchResult, 3000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [params.code]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-lg space-y-8">
        <h1 className="text-2xl font-bold text-center">결과</h1>

        {/* 내 점수 */}
        <section className="border rounded-lg p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">내 점수</p>
          <p data-testid="my-score" className="text-5xl font-bold">
            {data?.myScore ?? "-"}
          </p>
          <p data-testid="correct-count" className="text-sm text-muted-foreground">
            {data?.myCorrectCount ?? "-"} / {data?.myTotalCount ?? "-"} 정답
          </p>
        </section>

        {/* 랭킹 테이블 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">랭킹</h2>
          {data?.rankings.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 참여자가 없습니다.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left py-2 w-12">순위</th>
                  <th className="text-left py-2">닉네임</th>
                  <th className="text-right py-2 w-16">점수</th>
                </tr>
              </thead>
              <tbody>
                {data?.rankings.map((entry) => {
                  const isMe =
                    data.myGuestId !== null &&
                    entry.guestId === data.myGuestId;
                  return (
                    <tr
                      key={entry.guestId}
                      data-testid={isMe ? "my-rank-row" : "rank-row"}
                      className={
                        isMe
                          ? "font-bold highlight border-b bg-yellow-50"
                          : "border-b"
                      }
                    >
                      <td className="py-2">{entry.rank}</td>
                      <td className="py-2">{entry.nickname}</td>
                      <td
                        data-testid="rank-score"
                        className="py-2 text-right"
                      >
                        {entry.score}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
