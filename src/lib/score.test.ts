import { describe, test, expect } from "vitest";
import { calculateScore } from "./score";
import { DEFAULT_QUESTIONS } from "./questions";

const DEFAULT_ANSWERS = DEFAULT_QUESTIONS.map((q) => q.correct_index);

describe("calculateScore", () => {
  test("모든 기본 문항 정답 → 100점", () => {
    const answers: Record<string, number> = {};
    DEFAULT_QUESTIONS.forEach((q, i) => {
      answers[`default-${i}`] = q.correct_index;
    });
    const result = calculateScore(answers, DEFAULT_ANSWERS, []);
    expect(result.correctCount).toBe(10);
    expect(result.totalCount).toBe(10);
    expect(result.score).toBe(100);
  });

  test("모든 정답 미제출(빈 answers) → 0점", () => {
    const result = calculateScore({}, DEFAULT_ANSWERS, []);
    expect(result.correctCount).toBe(0);
    expect(result.totalCount).toBe(10);
    expect(result.score).toBe(0);
  });

  test("기본 5개 정답 → 50점", () => {
    const answers: Record<string, number> = {};
    for (let i = 0; i < 5; i++) {
      answers[`default-${i}`] = DEFAULT_ANSWERS[i]; // 정답
    }
    for (let i = 5; i < 10; i++) {
      answers[`default-${i}`] = (DEFAULT_ANSWERS[i] + 1) % 4; // 오답
    }
    const result = calculateScore(answers, DEFAULT_ANSWERS, []);
    expect(result.correctCount).toBe(5);
    expect(result.score).toBe(50);
  });

  test("커스텀 문항 정답 포함 점수 계산", () => {
    const answers: Record<string, number> = {};
    DEFAULT_QUESTIONS.forEach((q, i) => {
      answers[`default-${i}`] = q.correct_index; // 기본 10개 정답
    });
    answers["custom-uuid-1"] = 2; // 커스텀 정답

    const customQuestions = [{ id: "custom-uuid-1", correct_index: 2 }];
    const result = calculateScore(answers, DEFAULT_ANSWERS, customQuestions);

    expect(result.correctCount).toBe(11);
    expect(result.totalCount).toBe(11);
    expect(result.score).toBe(100);
  });

  test("커스텀 문항 오답 → 감점", () => {
    const answers: Record<string, number> = {};
    DEFAULT_QUESTIONS.forEach((q, i) => {
      answers[`default-${i}`] = q.correct_index; // 기본 10개 정답
    });
    answers["custom-uuid-1"] = 0; // 오답 (correct_index는 2)

    const customQuestions = [{ id: "custom-uuid-1", correct_index: 2 }];
    const result = calculateScore(answers, DEFAULT_ANSWERS, customQuestions);

    expect(result.correctCount).toBe(10);
    expect(result.totalCount).toBe(11);
    expect(result.score).toBe(Math.round((10 / 11) * 100)); // 91
  });

  test("answers 미제출 시 0점 (defaultAnswers 값 있음)", () => {
    // answers가 비어있고 defaultAnswers에 실제 값이 있으면 모두 불일치 → 0점
    const result = calculateScore({}, DEFAULT_ANSWERS, []);
    expect(result.totalCount).toBe(10);
    expect(result.score).toBe(0);
  });

  test("정답 기준 배열과 answers 불일치 → 해당 문항 오답 처리", () => {
    const wrongDefaultAnswers = [9, 9, 9, 9, 9, 9, 9, 9, 9, 9]; // 존재하지 않는 index
    const answers = { "default-0": 0 }; // 정답이 9인데 0을 선택
    const result = calculateScore(answers, wrongDefaultAnswers, []);
    expect(result.correctCount).toBe(0);
  });
});
