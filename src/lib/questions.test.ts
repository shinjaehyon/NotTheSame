import { describe, test, expect } from "vitest";
import { DEFAULT_QUESTIONS } from "./questions";

describe("DEFAULT_QUESTIONS", () => {
  test("정확히 10개 문항", () => {
    expect(DEFAULT_QUESTIONS).toHaveLength(10);
  });

  test("모든 문항에 question_text 존재", () => {
    DEFAULT_QUESTIONS.forEach((q, i) => {
      expect(q.question_text, `문항 ${i} question_text 누락`).toBeTruthy();
    });
  });

  test("모든 문항에 선택지 2개 이상", () => {
    DEFAULT_QUESTIONS.forEach((q, i) => {
      expect(q.options.length, `문항 ${i} options 부족`).toBeGreaterThanOrEqual(2);
    });
  });

  test("correct_index 가 options 범위 내에 있음", () => {
    DEFAULT_QUESTIONS.forEach((q, i) => {
      expect(
        q.correct_index,
        `문항 ${i} correct_index 범위 초과`
      ).toBeGreaterThanOrEqual(0);
      expect(
        q.correct_index,
        `문항 ${i} correct_index 범위 초과`
      ).toBeLessThan(q.options.length);
    });
  });

  test("모든 선택지 텍스트가 비어있지 않음", () => {
    DEFAULT_QUESTIONS.forEach((q, i) => {
      q.options.forEach((opt, oi) => {
        expect(opt.trim(), `문항 ${i} 선택지 ${oi} 빈 값`).toBeTruthy();
      });
    });
  });
});
