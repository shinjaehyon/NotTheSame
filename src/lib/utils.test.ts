import { describe, test, expect } from "vitest";
import { isValidUUID } from "./utils";

describe("isValidUUID", () => {
  test("유효한 UUID v4 형식 통과", () => {
    expect(isValidUUID("a0000000-0000-0000-0000-000000000001")).toBe(true);
    expect(isValidUUID("b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e")).toBe(true);
    expect(isValidUUID("00000000-0000-0000-0000-000000000000")).toBe(true);
  });

  test("대문자 포함 UUID 통과 (대소문자 무관)", () => {
    expect(isValidUUID("A0000000-0000-0000-0000-000000000001")).toBe(true);
    expect(isValidUUID("FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF")).toBe(true);
  });

  test("임의 문자열 거부", () => {
    expect(isValidUUID("test-uuid-host")).toBe(false);
    expect(isValidUUID("not-a-uuid")).toBe(false);
    expect(isValidUUID("")).toBe(false);
  });

  test("형식은 맞지만 길이 다른 경우 거부", () => {
    expect(isValidUUID("a0000000-0000-0000-0000-00000000000")).toBe(false);   // 짧음
    expect(isValidUUID("a0000000-0000-0000-0000-0000000000011")).toBe(false); // 김
  });

  test("구분자 위치가 다른 경우 거부", () => {
    expect(isValidUUID("a00000000-000-0000-0000-000000000001")).toBe(false);
  });
});
