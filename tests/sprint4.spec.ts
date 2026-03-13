import { test, expect } from "@playwright/test";

let roomCode: string;       // S4-1, S4-3용 (2문항)
let roomCodeSingle: string; // S4-4용 (1문항)

test.beforeAll(async ({ request }) => {
  // 2문항 방 (S4-1, S4-3용) — 커스텀 문항 2개, 기본 문항은 공유
  const res = await request.post("/api/quiz/create", {
    headers: { Cookie: "user_id=test-uuid-host" },
    data: {
      defaultAnswers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      customQuestions: [
        {
          question_text: "테스트 질문 1",
          options: ["A", "B", "C", "D"],
          correct_index: 0,
        },
        {
          question_text: "테스트 질문 2",
          options: ["가", "나", "다", "라"],
          correct_index: 1,
        },
      ],
    },
  });
  const body = await res.json();
  roomCode = body.accessCode;

  // 커스텀 문항 없는 방 (S4-4용) — 기본 10문항만
  const res2 = await request.post("/api/quiz/create", {
    headers: { Cookie: "user_id=test-uuid-host" },
    data: {
      defaultAnswers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      customQuestions: [],
    },
  });
  const body2 = await res2.json();
  roomCodeSingle = body2.accessCode;
});

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    {
      name: "user_id",
      value: "test-uuid-guest",
      domain: "localhost",
      path: "/",
    },
  ]);
});

test("S4-1: 유효한 접속 코드로 입장", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "참여하기" }).click();
  await page.getByPlaceholder("접속 코드 6자리").fill(roomCode);
  await page.getByRole("button", { name: "입장하기" }).click();
  await expect(page).toHaveURL(new RegExp(`/quiz/${roomCode}`));
});

test("S4-2: 잘못된 접속 코드 오류 표시", async ({ page }) => {
  await page.goto("/quiz/join");
  await page.getByPlaceholder("접속 코드 6자리").fill("XXXYYY");
  await page.getByRole("button", { name: "입장하기" }).click();
  await expect(page.getByText("존재하지 않는 퀴즈 코드입니다")).toBeVisible();
});

test("S4-3: 문항 단계별 진행 및 진행률 표시", async ({ page }) => {
  await page.goto(`/quiz/${roomCode}`);
  await expect(page.getByTestId("progress-bar")).toBeVisible();

  await page.getByTestId("option-0").click();
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByTestId("question-index")).toContainText("2 /");
});

test("S4-4: 전체 제출 후 result 페이지 이동", async ({ page }) => {
  await page.goto(`/quiz/${roomCodeSingle}`);
  await expect(page.getByTestId("progress-bar")).toBeVisible();

  // 기본 10문항 모두 순회 후 제출
  while (true) {
    await page.getByTestId("option-0").click();
    const submitBtn = page.getByRole("button", { name: "제출하기" });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      break;
    }
    await page.getByRole("button", { name: "다음" }).click();
  }
  await expect(page).toHaveURL(/\/result/, { timeout: 15000 });
});
