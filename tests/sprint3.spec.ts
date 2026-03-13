import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, context }) => {
  await context.addCookies([
    {
      name: "user_id",
      value: "test-uuid-host",
      domain: "localhost",
      path: "/",
    },
  ]);
  await page.goto("/quiz/create");
});

test("S3-1: 기본 문항 10개 표시 확인", async ({ page }) => {
  const questions = page.locator('[data-testid="question-item"]');
  await expect(questions).toHaveCount(10);
});

test("S3-2: 커스텀 문항 추가", async ({ page }) => {
  await page.getByRole("button", { name: "문항 추가" }).click();
  await page.getByPlaceholder("질문을 입력하세요").fill("내가 좋아하는 음식은?");
  await page.getByPlaceholder("선택지 1").fill("피자");
  await page.getByPlaceholder("선택지 2").fill("치킨");
  await page.getByRole("button", { name: "저장" }).click();
  await expect(page.getByText("내가 좋아하는 음식은?")).toBeVisible();
});

test("S3-3: 퀴즈 생성 후 6자리 코드 발급", async ({ page }) => {
  await page.getByRole("button", { name: "퀴즈 완성하기" }).click();
  const codeText = page.getByTestId("access-code");
  await expect(codeText).toBeVisible();
  const code = await codeText.textContent();
  expect(code).toMatch(/^[A-Z0-9]{6}$/);
});

test("S3-4: 접속 코드 클립보드 복사", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "퀴즈 완성하기" }).click();
  await page.getByRole("button", { name: "복사" }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toMatch(/^[A-Z0-9]{6}$/);
});
