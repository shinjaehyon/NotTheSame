import { test, expect } from "@playwright/test";

test("S1-1: 메인 페이지 로딩 확인", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/상호이해도 게임/);
  await expect(page.getByRole("button", { name: "방 만들기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "참여하기" })).toBeVisible();
});

test("S1-2: Supabase 헬스체크 API 응답 확인", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.db).toBe("connected");
});
