"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QuizJoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleJoin() {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/quiz/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.toUpperCase() }),
    });

    if (res.ok) {
      router.push(`/quiz/${code.toUpperCase()}`);
    } else {
      const data = await res.json();
      setError(data.error ?? "오류가 발생했습니다.");
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold">퀴즈 참여하기</h1>

        <div className="space-y-3">
          <Input
            placeholder="접속 코드 6자리"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          {error && (
            <p className="text-sm text-destructive text-left">{error}</p>
          )}
          <Button
            className="w-full"
            size="lg"
            onClick={handleJoin}
            disabled={loading || code.length === 0}
          >
            입장하기
          </Button>
        </div>
      </div>
    </main>
  );
}
