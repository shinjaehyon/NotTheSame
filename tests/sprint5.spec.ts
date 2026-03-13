import { test, expect } from "@playwright/test";

const GUEST_UUID = "a0000000-0000-0000-0000-000000000001";
const GUEST_UUID_2 = "a0000000-0000-0000-0000-000000000002";

let roomCode: string;

test.beforeAll(async ({ request }) => {
  // 방 생성
  const createRes = await request.post("/api/quiz/create", {
    headers: { Cookie: "user_id=test-uuid-host" },
    data: {
      questions: [
        {
          question_text: "질문1",
          options: ["A", "B", "C", "D"],
          correct_index: 0,
        },
        {
          question_text: "질문2",
          options: ["가", "나", "다", "라"],
          correct_index: 1,
        },
      ],
    },
  });
  const body = await createRes.json();
  roomCode = body.accessCode;

  // 게스트 1 제출 (고정 UUID → responses에 저장됨)
  await request.post("/api/quiz/submit", {
    headers: { Cookie: `user_id=${GUEST_UUID}` },
    data: { roomCode, answers: {} },
  });
});

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "user_id",
      value: GUEST_UUID,
      domain: "localhost",
      path: "/",
    },
  ]);
});

test("S5-1: 결과 페이지 점수 표시 확인", async ({ page }) => {
  await page.goto(`/result/${roomCode}`);
  await expect(page.getByTestId("my-score")).toBeVisible();
  await expect(page.getByTestId("correct-count")).toBeVisible();
});

test("S5-2: 랭킹 테이블 점수 내림차순 정렬 확인", async ({ page }) => {
  await page.goto(`/result/${roomCode}`);
  await expect(page.locator('[data-testid="rank-score"]').first()).toBeVisible();
  const scores = await page.locator('[data-testid="rank-score"]').allTextContents();
  const nums = scores.map((s) => parseInt(s));
  for (let i = 0; i < nums.length - 1; i++) {
    expect(nums[i]).toBeGreaterThanOrEqual(nums[i + 1]);
  }
});

test("S5-3: 본인 순위 강조 표시 확인", async ({ page }) => {
  await page.goto(`/result/${roomCode}`);
  const myRow = page.locator('[data-testid="my-rank-row"]');
  await expect(myRow).toBeVisible();
  await expect(myRow).toHaveClass(/font-bold/);
});

test("S5-4: 랭킹 실시간 갱신 (Supabase Realtime)", async ({ page, request }) => {
  await page.goto(`/result/${roomCode}`);
  await expect(page.locator('[data-testid="rank-score"]').first()).toBeVisible({ timeout: 10000 });
  const initialCount = await page.locator('[data-testid="rank-row"]').count();

  // 두 번째 게스트 제출
  await request.post("/api/quiz/submit", {
    headers: { Cookie: `user_id=${GUEST_UUID_2}` },
    data: { roomCode, answers: {} },
  });

  // Realtime 갱신 대기
  await page.waitForFunction(
    (prev) =>
      document.querySelectorAll('[data-testid="rank-row"]').length > prev,
    initialCount,
    { timeout: 8000 }
  );

  const updatedCount = await page.locator('[data-testid="rank-row"]').count();
  expect(updatedCount).toBeGreaterThan(initialCount);
});
