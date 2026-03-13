"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  question_text: string;
  options: string[];
}

export default function QuizPlayPage({
  params,
}: {
  params: { code: string };
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/${params.code}/questions`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions ?? []);
        setLoading(false);
      });
  }, [params.code]);

  async function handleSubmit() {
    setSubmitting(true);
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomCode: params.code, answers: selectedAnswers }),
    });

    if (res.ok) {
      router.push(`/result/${params.code}`);
    } else {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>불러오는 중...</p>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>문항이 없습니다.</p>
      </main>
    );
  }

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const hasSelected = selectedAnswers[question.id] !== undefined;

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {/* 진행률 */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span data-testid="question-index">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div
            data-testid="progress-bar"
            className="w-full bg-muted rounded-full h-2"
          >
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* 문항 */}
        <div className="space-y-4">
          <p className="text-lg font-semibold">{question.question_text}</p>

          <div className="grid grid-cols-1 gap-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                data-testid={`option-${i}`}
                onClick={() =>
                  setSelectedAnswers((prev) => ({
                    ...prev,
                    [question.id]: i,
                  }))
                }
                className={`w-full px-4 py-3 text-left rounded-lg border transition-colors ${
                  selectedAnswers[question.id] === i
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-input hover:bg-accent"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 다음 / 제출 */}
        {isLast ? (
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || !hasSelected}
          >
            {submitting ? "제출 중..." : "제출하기"}
          </Button>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={!hasSelected}
          >
            다음
          </Button>
        )}
      </div>
    </main>
  );
}
