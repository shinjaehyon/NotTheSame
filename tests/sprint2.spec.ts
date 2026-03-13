import { test, expect } from "@playwright/test";

test("S2-1: 닉네임 입력 후 쿠키 생성 확인", async ({ page, context }) => {
  await page.goto("/");
  await page.getByPlaceholder("닉네임을 입력하세요").fill("테스트유저");
  await page.getByRole("button", { name: "방 만들기" }).click();

  const cookies = await context.cookies();
  const sessionCookie = cookies.find((c) => c.name === "user_id");
  expect(sessionCookie).toBeDefined();
  expect(sessionCookie?.httpOnly).toBe(true);
});

test("S2-2: 쿠키 없이 퀴즈 페이지 접근 시 리다이렉트", async ({ page }) => {
  await page.goto("/quiz/create");
  await expect(page).toHaveURL("/");
});

test("S2-3: 닉네임 빈 값 제출 시 오류 표시", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "방 만들기" }).click();
  await expect(page.getByText("닉네임을 입력해주세요")).toBeVisible();
});
