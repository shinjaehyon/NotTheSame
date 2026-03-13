import { DEFAULT_QUESTIONS } from "@/lib/questions";

interface ScoreQuestion {
  id: string;
  correct_index: number;
}

export function calculateScore(
  answers: Record<string, number>,
  defaultAnswers: number[],
  customQuestions: ScoreQuestion[]
): { correctCount: number; totalCount: number; score: number } {
  let correctCount = 0;

  for (let i = 0; i < DEFAULT_QUESTIONS.length; i++) {
    if (answers[`default-${i}`] === defaultAnswers[i]) correctCount++;
  }

  for (const q of customQuestions) {
    if (answers[q.id] === q.correct_index) correctCount++;
  }

  const totalCount = DEFAULT_QUESTIONS.length + customQuestions.length;
  const score =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return { correctCount, totalCount, score };
}
