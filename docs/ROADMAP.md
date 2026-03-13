# 📋 ROADMAP: 상호이해도 게임

> **기준 문서:** `docs/PRD.md`
> **방법론:** Agile (스프린트 단위)
> **검증 도구:** Playwright MCP

---

## 전체 스프린트 구성

| 스프린트 | 목표 | 산출물 |
|---------|------|--------|
| Sprint 1 | 프로젝트 초기 설정 + Supabase 연동 | 실행 가능한 Next.js 앱 + DB 연결 확인 |
| Sprint 2 | UUID 익명 인증 + 세션 관리 | 닉네임 입력 → 쿠키 저장 → 리다이렉트 |
| Sprint 3 | 퀴즈 생성 (기본 + 커스텀) | 호스트가 퀴즈 만들고 코드 발급 |
| Sprint 4 | 퀴즈 풀이 화면 + 정답 체크 | 게스트가 퀴즈 풀고 결과 제출 |
| Sprint 5 | 결과 페이지 + 실시간 랭킹 | 점수 계산 + 순위 리더보드 |

---

## Sprint 1 — 프로젝트 초기 설정 및 Supabase 연동

### 목표
Next.js 앱을 세팅하고 Supabase와 연결. 4개 테이블 마이그레이션 완료.

### User Stories
- `US-1-1` 개발자로서, `npm run dev`로 앱이 실행되어야 한다.
- `US-1-2` 개발자로서, Supabase 클라이언트가 초기화되고 DB에 연결되어야 한다.
- `US-1-3` 개발자로서, `users`, `quiz_rooms`, `questions`, `responses` 테이블이 생성되어야 한다.

### 완료 기준 (Definition of Done)
- [v] `npx create-next-app` + TypeScript + Tailwind + Shadcn/UI 설정 완료
- [v] `.env.local`에 Supabase URL/Key 설정
- [v] 4개 테이블 스키마 마이그레이션 적용
- [v] Supabase 연결 확인 (헬스체크 API 라우트)

### Playwright MCP 검증 시나리오

```typescript
// tests/sprint1.spec.ts
import { test, expect } from '@playwright/test';

test('S1-1: 메인 페이지 로딩 확인', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/상호이해도 게임/);
  await expect(page.getByRole('button', { name: '방 만들기' })).toBeVisible();
  await expect(page.getByRole('button', { name: '참여하기' })).toBeVisible();
});

test('S1-2: Supabase 헬스체크 API 응답 확인', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.db).toBe('connected');
});
```

---

## Sprint 2 — UUID 기반 익명 인증 + 세션 관리

### 목표
닉네임 입력만으로 UUID를 생성해 HTTP-Only 쿠키에 저장. 미인증 사용자 리다이렉트 구현.

### User Stories
- `US-2-1` 사용자로서, 닉네임을 입력하면 UUID가 생성되고 세션이 유지되어야 한다.
- `US-2-2` 사용자로서, 세션 없이 퀴즈 페이지 접근 시 메인 페이지로 이동해야 한다.
- `US-2-3` 사용자로서, `users` 테이블에 내 닉네임과 UUID가 저장되어야 한다.

### 완료 기준 (Definition of Done)
- [v] 닉네임 입력 폼 + 유효성 검사 (빈 값 방지)
- [v] `crypto.randomUUID()` 또는 DB UUID PK 생성
- [v] HTTP-Only 쿠키 설정 (`Set-Cookie` 헤더)
- [v] Next.js Middleware로 미인증 접근 차단 + `/` 리다이렉트
- [v] `users` 테이블 INSERT 확인

### Playwright MCP 검증 시나리오

```typescript
// tests/sprint2.spec.ts
import { test, expect } from '@playwright/test';

test('S2-1: 닉네임 입력 후 쿠키 생성 확인', async ({ page, context }) => {
  await page.goto('/');
  await page.getByPlaceholder('닉네임을 입력하세요').fill('테스트유저');
  await page.getByRole('button', { name: '방 만들기' }).click();

  const cookies = await context.cookies();
  const sessionCookie = cookies.find(c => c.name === 'user_id');
  expect(sessionCookie).toBeDefined();
  expect(sessionCookie?.httpOnly).toBe(true);
});

test('S2-2: 쿠키 없이 퀴즈 페이지 접근 시 리다이렉트', async ({ page }) => {
  await page.goto('/quiz/create');
  await expect(page).toHaveURL('/');
});

test('S2-3: 닉네임 빈 값 제출 시 오류 표시', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '방 만들기' }).click();
  await expect(page.getByText('닉네임을 입력해주세요')).toBeVisible();
});
```

---

## Sprint 3 — 퀴즈 생성 UI + DB 저장 (기본 + 커스텀)

### 목표
호스트가 기본 10문항을 확인하고, 커스텀 문항을 추가/편집할 수 있으며, 6자리 접속 코드가 발급된다.

### User Stories
- `US-3-1` 호스트로서, 기본 제공 10문항을 확인하고 정답을 선택할 수 있어야 한다.
- `US-3-2` 호스트로서, 커스텀 질문(최대 4개 선택지)을 추가/편집/삭제할 수 있어야 한다.
- `US-3-3` 호스트로서, 퀴즈 생성 완료 시 6자리 접속 코드를 받아야 한다.
- `US-3-4` 호스트로서, 접속 코드를 클립보드에 복사할 수 있어야 한다.

### 완료 기준 (Definition of Done)
- [ ] `quiz_rooms` + `questions` 테이블 INSERT 로직
- [ ] 6자리 영문/숫자 코드 생성 (중복 방지)
- [ ] 커스텀 문항 CRUD UI (Shadcn/UI 컴포넌트 활용)
- [ ] 코드 발급 화면 + 클립보드 복사 버튼

### Playwright MCP 검증 시나리오

```typescript
// tests/sprint3.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  // 사전 인증 쿠키 설정
  await context.addCookies([{ name: 'user_id', value: 'test-uuid-host', domain: 'localhost', path: '/' }]);
  await page.goto('/quiz/create');
});

test('S3-1: 기본 문항 10개 표시 확인', async ({ page }) => {
  const questions = page.locator('[data-testid="question-item"]');
  await expect(questions).toHaveCount(10);
});

test('S3-2: 커스텀 문항 추가', async ({ page }) => {
  await page.getByRole('button', { name: '문항 추가' }).click();
  await page.getByPlaceholder('질문을 입력하세요').fill('내가 좋아하는 음식은?');
  await page.getByPlaceholder('선택지 1').fill('피자');
  await page.getByPlaceholder('선택지 2').fill('치킨');
  await page.getByRole('button', { name: '저장' }).click();
  await expect(page.getByText('내가 좋아하는 음식은?')).toBeVisible();
});

test('S3-3: 퀴즈 생성 후 6자리 코드 발급', async ({ page }) => {
  await page.getByRole('button', { name: '퀴즈 완성하기' }).click();
  const codeText = page.getByTestId('access-code');
  await expect(codeText).toBeVisible();
  const code = await codeText.textContent();
  expect(code).toMatch(/^[A-Z0-9]{6}$/);
});

test('S3-4: 접속 코드 클립보드 복사', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: '퀴즈 완성하기' }).click();
  await page.getByRole('button', { name: '복사' }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toMatch(/^[A-Z0-9]{6}$/);
});
```

---

## Sprint 4 — 퀴즈 풀이 화면 + 정답 체크

### 목표
게스트가 접속 코드로 방에 입장하고, 문항을 순서대로 풀고, 답변을 DB에 저장한다.

### User Stories
- `US-4-1` 게스트로서, 6자리 코드를 입력해 퀴즈 방에 입장할 수 있어야 한다.
- `US-4-2` 게스트로서, 문항을 단계별로 풀고 선택지를 클릭해 답변할 수 있어야 한다.
- `US-4-3` 게스트로서, 모든 문항 제출 시 `responses` 테이블에 점수가 저장되어야 한다.
- `US-4-4` 게스트로서, 잘못된 접속 코드 입력 시 오류 메시지를 받아야 한다.

### 완료 기준 (Definition of Done)
- [ ] 코드 입력 → `quiz_rooms` 조회 → 입장 처리
- [ ] 문항 단계별 UI (모바일 대응, progress bar 포함)
- [ ] 선택지 클릭 → 상태 저장 (Zustand)
- [ ] 제출 시 `responses` INSERT (점수 계산 포함)
- [ ] 잘못된 코드 오류 처리

### Playwright MCP 검증 시나리오

```typescript
// tests/sprint4.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: 'user_id', value: 'test-uuid-guest', domain: 'localhost', path: '/' }]);
});

test('S4-1: 유효한 접속 코드로 입장', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '참여하기' }).click();
  await page.getByPlaceholder('접속 코드 6자리').fill('ABC123');
  await page.getByRole('button', { name: '입장하기' }).click();
  await expect(page).toHaveURL(/\/quiz\/ABC123/);
});

test('S4-2: 잘못된 접속 코드 오류 표시', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '참여하기' }).click();
  await page.getByPlaceholder('접속 코드 6자리').fill('XXXYYY');
  await page.getByRole('button', { name: '입장하기' }).click();
  await expect(page.getByText('존재하지 않는 퀴즈 코드입니다')).toBeVisible();
});

test('S4-3: 문항 단계별 진행 및 진행률 표시', async ({ page }) => {
  await page.goto('/quiz/ABC123');
  await expect(page.getByTestId('progress-bar')).toBeVisible();

  // 첫 번째 문항 선택
  await page.getByTestId('option-0').click();
  await page.getByRole('button', { name: '다음' }).click();
  await expect(page.getByTestId('question-index')).toContainText('2 /');
});

test('S4-4: 전체 제출 후 responses 저장 확인', async ({ page, request }) => {
  await page.goto('/quiz/ABC123');
  // 모든 문항 선택지 클릭 후 제출
  const questionCount = await page.locator('[data-testid="option-0"]').count();
  for (let i = 0; i < questionCount; i++) {
    await page.getByTestId('option-0').click();
    const nextBtn = page.getByRole('button', { name: i < questionCount - 1 ? '다음' : '제출하기' });
    await nextBtn.click();
  }
  await expect(page).toHaveURL(/\/result/);
});
```

---

## Sprint 5 — 결과 페이지 + 실시간 랭킹 리더보드

### 목표
제출 후 본인 점수와 전체 랭킹을 확인. 본인 순위 강조 표시. 실시간 업데이트.

### User Stories
- `US-5-1` 게스트로서, 제출 후 내 점수와 정답 수를 확인할 수 있어야 한다.
- `US-5-2` 게스트로서, 전체 참여자 랭킹을 점수 높은 순으로 볼 수 있어야 한다.
- `US-5-3` 게스트로서, 랭킹 테이블에서 내 순위가 강조 표시되어야 한다.
- `US-5-4` 새 참여자가 제출하면 랭킹이 실시간으로 갱신되어야 한다.

### 완료 기준 (Definition of Done)
- [ ] 결과 페이지: 점수, 정답 수, 전체 문항 수 표시
- [ ] 랭킹 테이블: `responses` 조회 → 점수 내림차순 정렬
- [ ] 본인 행 강조 (배경색/볼드 처리)
- [ ] Supabase Realtime 구독으로 자동 갱신

### Playwright MCP 검증 시나리오

```typescript
// tests/sprint5.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  await context.addCookies([{ name: 'user_id', value: 'test-uuid-guest', domain: 'localhost', path: '/' }]);
});

test('S5-1: 결과 페이지 점수 표시 확인', async ({ page }) => {
  await page.goto('/result/ABC123');
  await expect(page.getByTestId('my-score')).toBeVisible();
  await expect(page.getByTestId('correct-count')).toBeVisible();
});

test('S5-2: 랭킹 테이블 점수 내림차순 정렬 확인', async ({ page }) => {
  await page.goto('/result/ABC123');
  const scores = await page.locator('[data-testid="rank-score"]').allTextContents();
  const nums = scores.map(s => parseInt(s));
  for (let i = 0; i < nums.length - 1; i++) {
    expect(nums[i]).toBeGreaterThanOrEqual(nums[i + 1]);
  }
});

test('S5-3: 본인 순위 강조 표시 확인', async ({ page }) => {
  await page.goto('/result/ABC123');
  const myRow = page.locator('[data-testid="my-rank-row"]');
  await expect(myRow).toBeVisible();
  // 강조 클래스 또는 스타일 확인
  await expect(myRow).toHaveClass(/highlight|font-bold/);
});

test('S5-4: 랭킹 실시간 갱신 (Supabase Realtime)', async ({ page }) => {
  await page.goto('/result/ABC123');
  const initialCount = await page.locator('[data-testid="rank-row"]').count();

  // 새 제출 시뮬레이션 (API 직접 호출)
  await page.request.post('/api/submit', {
    data: { roomCode: 'ABC123', guestId: 'new-test-uuid', score: 80 }
  });

  // Realtime 갱신 대기
  await page.waitForFunction(
    (prev) => document.querySelectorAll('[data-testid="rank-row"]').length > prev,
    initialCount,
    { timeout: 5000 }
  );

  const updatedCount = await page.locator('[data-testid="rank-row"]').count();
  expect(updatedCount).toBeGreaterThan(initialCount);
});
```

---

## Playwright 설정 가이드

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'Mobile Chrome', use: { browserName: 'chromium', ...devices['Pixel 5'] } },
  ],
});
```

```bash
# 테스트 실행 명령어
npx playwright test                        # 전체 테스트
npx playwright test tests/sprint1.spec.ts  # 특정 스프린트만
npx playwright test --ui                   # UI 모드 (디버깅)
npx playwright show-report                 # HTML 리포트
```

---

## 진행 상황 추적

| 스프린트 | 상태 | 시작일 | 완료일 |
|---------|------|--------|--------|
| Sprint 1 | ✅ 완료 | 2026-03-13 | 2026-03-13 |
| Sprint 2 | ✅ 완료 | 2026-03-13 | 2026-03-13 |
| Sprint 3 | 🔲 대기 | - | - |
| Sprint 4 | 🔲 대기 | - | - |
| Sprint 5 | 🔲 대기 | - | - |
