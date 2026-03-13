import { test, expect } from "@playwright/test";

const HOST_UUID = "b0000000-0000-0000-0000-000000000001";
const GUEST_UUID = "b0000000-0000-0000-0000-000000000002";

let roomCode: string;

test.beforeAll(async ({ request }) => {
  // HOST_UUID로 방 생성
  const res = await request.post("/api/quiz/create", {
    headers: { Cookie: `user_id=${HOST_UUID}` },
    data: {
      defaultAnswers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      customQuestions: [
        {
          question_text: "S6 커스텀 질문",
          options: ["X", "Y", "Z"],
          correct_index: 1,
        },
      ],
    },
  });
  const body = await res.json();
  roomCode = body.accessCode;
});

test("S6-1: 기존 방이 있는 유저 홈에서 '내 답변 보기' 버튼 노출", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "user_id", value: HOST_UUID, domain: "localhost", path: "/" },
  ]);
  await page.goto("/");
  await expect(page.getByTestId("my-room-btn")).toBeVisible();
});

test("S6-2: 방 2개 생성 시도 시 409 반환", async ({ request }) => {
  const res = await request.post("/api/quiz/create", {
    headers: { Cookie: `user_id=${HOST_UUID}` },
    data: {
      defaultAnswers: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      customQuestions: [],
    },
  });
  expect(res.status()).toBe(409);
  const body = await res.json();
  expect(body.error).toBe("room_exists");
  expect(body.accessCode).toBe(roomCode);
});

test("S6-3: edit 모드에서 기존 데이터 로드 확인", async ({ page, context }) => {
  await context.addCookies([
    { name: "user_id", value: HOST_UUID, domain: "localhost", path: "/" },
  ]);
  await page.goto(`/quiz/create?edit=${roomCode}`);
  // 기본 문항 10개 표시 확인
  await expect(page.locator('[data-testid="question-item"]').first()).toBeVisible();
  // 커스텀 문항 로드 확인
  await expect(page.getByText("S6 커스텀 질문")).toBeVisible({ timeout: 5000 });
});

test("S6-4: edit 모드 저장 후 변경 내용 반영 확인", async ({ page, context, request }) => {
  await context.addCookies([
    { name: "user_id", value: HOST_UUID, domain: "localhost", path: "/" },
  ]);
  await page.goto(`/quiz/create?edit=${roomCode}`);
  // 기존 데이터 로드 대기
  await expect(page.getByText("S6 커스텀 질문")).toBeVisible({ timeout: 5000 });

  // 수정 완료 버튼 클릭
  await page.getByRole("button", { name: "수정 완료" }).click();
  await expect(page.getByTestId("access-code")).toBeVisible({ timeout: 5000 });
  const code = await page.getByTestId("access-code").textContent();
  expect(code).toBe(roomCode);
});

test("S6-5: 결과 페이지에 '홈으로' 버튼 표시", async ({ page, context }) => {
  // 게스트로 결과 페이지 접근
  await context.addCookies([
    { name: "user_id", value: GUEST_UUID, domain: "localhost", path: "/" },
  ]);
  // 먼저 제출하여 결과 생성
  await page.request.post("/api/quiz/submit", {
    data: { roomCode, answers: {} },
  });
  await page.goto(`/result/${roomCode}`);
  await expect(page.getByTestId("home-btn")).toBeVisible();
});

test("S6-6: 기본+커스텀 병합 문항으로 퀴즈 플레이 정상 동작", async ({
  page,
  context,
}) => {
  await context.addCookies([
    { name: "user_id", value: GUEST_UUID, domain: "localhost", path: "/" },
  ]);
  await page.goto(`/quiz/${roomCode}`);
  await expect(page.getByTestId("progress-bar")).toBeVisible();
  // 기본 10 + 커스텀 1 = 11 문항 확인 (question-index에 "/ 11" 포함)
  await expect(page.getByTestId("question-index")).toContainText("/ 11");
});
