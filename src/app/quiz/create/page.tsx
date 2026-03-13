"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_QUESTIONS, type Question } from "@/lib/questions";

interface CustomQuestion {
  question_text: string;
  options: string[];
  correct_index: number;
}

type Phase = "edit" | "done";

export default function QuizCreatePage() {
  const [defaultAnswers, setDefaultAnswers] = useState<number[]>(
    DEFAULT_QUESTIONS.map((q) => q.correct_index)
  );
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formText, setFormText] = useState("");
  const [formOptions, setFormOptions] = useState(["", "", "", ""]);
  const [formCorrect, setFormCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>("edit");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSaveCustom() {
    if (!formText.trim()) return;
    const filledOptions = formOptions.filter((o) => o.trim() !== "");
    if (filledOptions.length < 2) return;

    setCustomQuestions((prev) => [
      ...prev,
      {
        question_text: formText.trim(),
        options: filledOptions,
        correct_index: formCorrect,
      },
    ]);
    setFormText("");
    setFormOptions(["", "", "", ""]);
    setFormCorrect(0);
    setShowForm(false);
  }

  function handleDeleteCustom(index: number) {
    setCustomQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setLoading(true);
    const questions: Question[] = [
      ...DEFAULT_QUESTIONS.map((q, i) => ({
        ...q,
        correct_index: defaultAnswers[i],
      })),
      ...customQuestions,
    ];

    const res = await fetch("/api/quiz/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions }),
    });

    if (res.ok) {
      const data = await res.json();
      setAccessCode(data.accessCode);
      setPhase("done");
    }
    setLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(accessCode);
  }

  if (phase === "done") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-2xl font-bold">퀴즈 완성!</h1>
          <p className="text-sm text-muted-foreground">
            아래 코드를 친구에게 공유하세요
          </p>
          <p
            data-testid="access-code"
            className="text-4xl font-mono font-bold tracking-widest"
          >
            {accessCode}
          </p>
          <Button onClick={handleCopy} className="w-full">
            복사
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-2xl font-bold text-center">퀴즈 만들기</h1>

        {/* 기본 문항 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">기본 문항</h2>
          {DEFAULT_QUESTIONS.map((q, qi) => (
            <div
              key={qi}
              data-testid="question-item"
              className="border rounded-lg p-4 space-y-2"
            >
              <p className="font-medium">{q.question_text}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() =>
                      setDefaultAnswers((prev) => {
                        const next = [...prev];
                        next[qi] = oi;
                        return next;
                      })
                    }
                    className={`px-3 py-2 text-sm rounded border transition-colors ${
                      defaultAnswers[qi] === oi
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input hover:bg-accent"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* 커스텀 문항 */}
        {customQuestions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">커스텀 문항</h2>
            {customQuestions.map((q, i) => (
              <div
                key={i}
                data-testid="question-item"
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <p className="font-medium">{q.question_text}</p>
                  <button
                    onClick={() => handleDeleteCustom(i)}
                    className="text-sm text-destructive ml-2"
                  >
                    삭제
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, oi) => (
                    <span
                      key={oi}
                      className={`px-2 py-1 text-sm rounded border ${
                        q.correct_index === oi
                          ? "bg-primary text-primary-foreground"
                          : "border-input"
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* 문항 추가 폼 */}
        {showForm ? (
          <div className="border rounded-lg p-4 space-y-3">
            <Input
              placeholder="질문을 입력하세요"
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
            />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={formCorrect === i}
                  onChange={() => setFormCorrect(i)}
                />
                <Input
                  placeholder={`선택지 ${i + 1}`}
                  value={formOptions[i]}
                  onChange={(e) => {
                    const next = [...formOptions];
                    next[i] = e.target.value;
                    setFormOptions(next);
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleSaveCustom} className="flex-1">
                저장
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowForm(true)}
          >
            문항 추가
          </Button>
        )}

        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "생성 중..." : "퀴즈 완성하기"}
        </Button>
      </div>
    </main>
  );
}
