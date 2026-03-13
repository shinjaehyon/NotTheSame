# Sprint 1 상세 계획서 — 프로젝트 초기 설정 및 Supabase 연동

> **프로젝트:** 상호이해도 게임 (Not the Same Person You Used to Know)
> **스프린트:** Sprint 1 / 5
> **작성일:** 2026-03-13
> **참조 문서:** `docs/PRD.md`, `docs/ROADMAP.md`

---

## 1. 스프린트 목표

Next.js 14+ (App Router) 기반의 프로젝트 뼈대를 구성하고, Supabase와의 연결을 완료한다.
이 스프린트가 완료되면 다음 스프린트들의 기반이 되는 **실행 가능한 Next.js 앱**과 **DB 연결이 확인된 환경**이 마련된다.

### 핵심 달성 목표

- `npm run dev` 실행 시 메인 페이지가 정상 노출된다.
- Supabase 클라이언트가 초기화되고 DB에 성공적으로 연결된다.
- `users`, `quiz_rooms`, `questions`, `responses` 4개 테이블 마이그레이션이 완료된다.
- `/api/health` 엔드포인트에서 DB 연결 상태를 확인할 수 있다.

---

## 2. 스프린트 기간

| 항목 | 내용 |
|------|------|
| **시작일** | 2026-03-13 (금) |
| **종료일** | 2026-03-26 (목) |
| **기간** | 2주 (14일) |
| **방법론** | Agile — 1주 단위 중간 점검 포함 |

### 주차별 일정

| 주차 | 기간 | 주요 작업 |
|------|------|-----------|
| 1주차 | 3/13 ~ 3/19 | Next.js 설치, 환경 설정, Supabase 프로젝트 생성 |
| 2주차 | 3/20 ~ 3/26 | DB 마이그레이션, 헬스체크 API, 메인 UI 초안, 테스트 작성 |

---

## 3. User Stories

| ID | 역할 | 스토리 | 우선순위 |
|----|------|--------|---------|
| US-1-1 | 개발자 | `npm run dev`로 앱이 정상 실행되어야 한다. | 필수 |
| US-1-2 | 개발자 | Supabase 클라이언트가 초기화되고 DB에 연결되어야 한다. | 필수 |
| US-1-3 | 개발자 | `users`, `quiz_rooms`, `questions`, `responses` 테이블이 생성되어야 한다. | 필수 |

---

## 4. 구현 범위 (In-Scope / Out-of-Scope)

### In-Scope (이번 스프린트에서 구현)

- Next.js 14 App Router 프로젝트 생성 및 기본 설정
- TypeScript, Tailwind CSS, Shadcn/UI 초기 설정
- Supabase 클라이언트 라이브러리 설치 및 초기화
- `.env.local` 환경 변수 구성
- 4개 테이블 SQL 마이그레이션 스크립트 작성 및 적용
- `/api/health` 헬스체크 API 라우트 구현
- 메인 페이지 기본 UI — 앱 타이틀 + [방 만들기] + [참여하기] 버튼 배치
- Playwright 테스트 환경 설정 및 Sprint 1 테스트 케이스 작성

### Out-of-Scope (이후 스프린트에서 구현)

- 닉네임 입력 및 UUID 인증 로직 (Sprint 2)
- 퀴즈 생성/편집 UI (Sprint 3)
- 퀴즈 풀이 화면 (Sprint 4)
- 결과 및 랭킹 페이지 (Sprint 5)
- 실시간 기능 (Supabase Realtime) (Sprint 5)

---

## 5. 작업 분해 (Task Breakdown)

### T1-1. Next.js 프로젝트 초기화
- **담당:** 개발자
- **예상 소요:** 0.5일
- **작업 내용:**
  - `npx create-next-app@latest` 실행 (TypeScript, ESLint, Tailwind CSS, App Router 선택)
  - `.gitignore` 검토 및 `.env.local` 항목 추가 확인
  - `package.json` 초기 의존성 확인

### T1-2. Shadcn/UI 설정
- **담당:** 개발자
- **예상 소요:** 0.5일
- **작업 내용:**
  - `npx shadcn-ui@latest init` 실행
  - 기본 컴포넌트 테마 설정 (색상, 라운드 등)
  - Button 컴포넌트 추가 (`npx shadcn-ui@latest add button`)

### T1-3. Supabase 프로젝트 생성 및 클라이언트 설정
- **담당:** 개발자
- **예상 소요:** 1일
- **작업 내용:**
  - Supabase 대시보드에서 새 프로젝트 생성
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 값 확보
  - `@supabase/supabase-js` 패키지 설치
  - `lib/supabase/client.ts` — 브라우저용 Supabase 클라이언트 생성
  - `lib/supabase/server.ts` — 서버 컴포넌트/라우트 핸들러용 Supabase 클라이언트 생성
  - `.env.local` 파일에 환경 변수 작성 (`.env.local.example`도 함께 생성)

### T1-4. 데이터베이스 스키마 마이그레이션
- **담당:** 개발자
- **예상 소요:** 1일
- **작업 내용:**
  - `supabase/migrations/` 디렉토리 생성
  - `001_initial_schema.sql` 마이그레이션 파일 작성 (4개 테이블 DDL)
  - Supabase SQL 에디터 또는 CLI를 통해 마이그레이션 적용
  - Supabase 대시보드에서 테이블 생성 확인

### T1-5. 헬스체크 API 라우트 구현
- **담당:** 개발자
- **예상 소요:** 0.5일
- **작업 내용:**
  - `app/api/health/route.ts` 파일 생성
  - Supabase에 간단한 쿼리(`SELECT 1`)를 실행하여 연결 상태 확인
  - 정상 시 `{ status: "ok", db: "connected" }` 응답
  - 오류 시 `{ status: "error", db: "disconnected" }` 응답

### T1-6. 메인 페이지 기본 UI 구현
- **담당:** 개발자
- **예상 소요:** 1일
- **작업 내용:**
  - `app/page.tsx` — 메인 페이지 컴포넌트 작성
  - 앱 타이틀 "상호이해도 게임" 표시
  - [방 만들기] 버튼 배치 (Shadcn/UI Button 컴포넌트)
  - [참여하기] 버튼 배치 (Shadcn/UI Button 컴포넌트)
  - 모바일 우선 반응형 레이아웃 적용 (Tailwind CSS)
  - `<title>` 메타데이터 설정 (`상호이해도 게임`)

### T1-7. Playwright 테스트 환경 구성 및 테스트 작성
- **담당:** 개발자
- **예상 소요:** 1일
- **작업 내용:**
  - `npm install -D @playwright/test` 및 `npx playwright install`
  - `playwright.config.ts` 설정 (baseURL, Chromium + Mobile Chrome)
  - `tests/sprint1.spec.ts` 작성 (S1-1, S1-2 테스트 케이스)
  - CI 환경을 위한 `package.json` 스크립트 추가 (`test:e2e`)

---

## 6. 기술적 접근 방법

### 6-1. 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (폰트, 메타데이터)
│   ├── page.tsx            # 메인 페이지 (방 만들기 / 참여하기)
│   └── api/
│       └── health/
│           └── route.ts    # Supabase 헬스체크 API
├── lib/
│   └── supabase/
│       ├── client.ts       # 브라우저용 클라이언트
│       └── server.ts       # 서버용 클라이언트
└── components/
    └── ui/                 # Shadcn/UI 컴포넌트 (auto-generated)

supabase/
└── migrations/
    └── 001_initial_schema.sql

tests/
└── sprint1.spec.ts

playwright.config.ts
.env.local
.env.local.example
```

### 6-2. 데이터베이스 마이그레이션 SQL

```sql
-- supabase/migrations/001_initial_schema.sql

-- users 테이블
CREATE TABLE IF NOT EXISTS users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname   text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now()
);

-- quiz_rooms 테이블
CREATE TABLE IF NOT EXISTS quiz_rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_code text UNIQUE NOT NULL,
  host_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  timestamp WITH TIME ZONE DEFAULT now()
);

-- questions 테이블
CREATE TABLE IF NOT EXISTS questions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id       uuid NOT NULL REFERENCES quiz_rooms(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options       jsonb NOT NULL,
  correct_index int  NOT NULL
);

-- responses 테이블
CREATE TABLE IF NOT EXISTS responses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      uuid NOT NULL REFERENCES quiz_rooms(id) ON DELETE CASCADE,
  guest_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score        int  NOT NULL DEFAULT 0,
  completed_at timestamp WITH TIME ZONE DEFAULT now()
);
```

### 6-3. Supabase 클라이언트 패턴

- **브라우저 클라이언트 (`lib/supabase/client.ts`):** `createBrowserClient` 사용. Client Component에서 호출.
- **서버 클라이언트 (`lib/supabase/server.ts`):** `createServerClient` + Next.js `cookies()` 사용. Server Component 및 Route Handler에서 호출.
- 환경 변수는 `NEXT_PUBLIC_` 접두사를 사용하여 클라이언트 번들에도 포함.

### 6-4. 헬스체크 API 설계

```
GET /api/health
Response 200: { "status": "ok", "db": "connected" }
Response 500: { "status": "error", "db": "disconnected", "message": "..." }
```

- 서버 클라이언트로 `SELECT 1` 쿼리 실행
- 오류 발생 시 500 상태 코드 반환

---

## 7. 의존성 및 리스크

### 외부 의존성

| 의존성 | 내용 | 비고 |
|--------|------|------|
| Supabase 계정 | 프로젝트 생성 및 API 키 발급 필요 | 무료 플랜 사용 가능 |
| Node.js | v18 이상 권장 | Next.js 14 요구사항 |
| npm / npx | 패키지 설치 도구 | |

### 패키지 의존성

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@playwright/test": "^1.x"
  }
}
```

### 리스크 및 대응 방안

| 리스크 | 발생 가능성 | 영향도 | 대응 방안 |
|--------|------------|--------|-----------|
| Supabase 무료 플랜 제한 (일시 정지) | 낮음 | 중간 | 개발 중에는 로컬 Supabase CLI 활용 검토 |
| Next.js 버전과 Shadcn/UI 호환성 이슈 | 낮음 | 낮음 | 공식 문서의 버전 조합 확인 후 설치 |
| `.env.local` 환경 변수 누락으로 빌드 실패 | 중간 | 높음 | `.env.local.example` 파일 제공 및 README 가이드 작성 |
| Playwright 브라우저 설치 실패 (네트워크) | 낮음 | 낮음 | 오프라인 환경 시 `--skip-browser-download` 후 수동 설치 |

---

## 8. 완료 기준 (Definition of Done)

### 기능 완료 기준

- [ ] `npm run dev` 실행 후 `http://localhost:3000` 에서 메인 페이지가 정상 노출된다.
- [ ] 메인 페이지에 앱 타이틀 "상호이해도 게임"가 표시된다.
- [ ] 메인 페이지에 [방 만들기], [참여하기] 버튼이 각각 표시된다.
- [ ] `.env.local`에 Supabase URL 및 Anon Key가 올바르게 설정되어 있다.
- [ ] `users`, `quiz_rooms`, `questions`, `responses` 4개 테이블이 Supabase 대시보드에서 확인된다.
- [ ] `GET /api/health` 요청 시 `{ "db": "connected" }` 응답이 반환된다.

### 코드 품질 기준

- [ ] TypeScript 컴파일 오류 없음 (`npm run build` 성공)
- [ ] ESLint 경고 없음 (`npm run lint` 통과)
- [ ] `.env.local`이 `.gitignore`에 포함되어 있다.
- [ ] `.env.local.example` 파일이 존재하며 필요한 키 목록이 명시되어 있다.

### 테스트 완료 기준

- [ ] Playwright 테스트 `S1-1: 메인 페이지 로딩 확인` 통과
- [ ] Playwright 테스트 `S1-2: Supabase 헬스체크 API 응답 확인` 통과

---

## 9. Playwright 검증 시나리오

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

### 테스트 실행 방법

```bash
# 개발 서버 실행 (별도 터미널)
npm run dev

# Sprint 1 테스트 실행
npx playwright test tests/sprint1.spec.ts

# UI 모드로 디버깅
npx playwright test tests/sprint1.spec.ts --ui

# 전체 테스트 실행
npx playwright test
```

---

## 10. 예상 산출물

### 소스 코드 파일

| 파일 경로 | 설명 |
|----------|------|
| `src/app/layout.tsx` | 루트 레이아웃 — 메타데이터(타이틀 포함) 설정 |
| `src/app/page.tsx` | 메인 페이지 — 타이틀, [방 만들기], [참여하기] 버튼 |
| `src/app/api/health/route.ts` | Supabase DB 연결 상태 확인 API |
| `src/lib/supabase/client.ts` | 브라우저용 Supabase 클라이언트 |
| `src/lib/supabase/server.ts` | 서버용 Supabase 클라이언트 |
| `src/components/ui/button.tsx` | Shadcn/UI Button 컴포넌트 (auto-generated) |
| `playwright.config.ts` | Playwright 설정 파일 |
| `tests/sprint1.spec.ts` | Sprint 1 E2E 테스트 시나리오 |

### 인프라/설정 파일

| 파일 경로 | 설명 |
|----------|------|
| `.env.local` | Supabase URL/Key 환경 변수 (git 제외) |
| `.env.local.example` | 환경 변수 키 목록 예시 파일 (git 포함) |
| `supabase/migrations/001_initial_schema.sql` | 4개 테이블 DDL 마이그레이션 파일 |
| `package.json` | 의존성 및 스크립트 정의 |
| `tsconfig.json` | TypeScript 설정 |
| `tailwind.config.ts` | Tailwind CSS 설정 |
| `components.json` | Shadcn/UI 설정 |

### 검증 결과

| 항목 | 기대 결과 |
|------|-----------|
| `npm run dev` | 로컬 서버 정상 구동 (`localhost:3000`) |
| `npm run build` | TypeScript 컴파일 및 빌드 성공 |
| `npm run lint` | ESLint 오류 없음 |
| Playwright 테스트 | S1-1, S1-2 모두 Pass |
| Supabase 대시보드 | 4개 테이블 확인 |

---

## 11. 다음 스프린트 준비 (Sprint 2 예고)

Sprint 1 완료 후 Sprint 2에서는 **UUID 기반 익명 인증 + 세션 관리**를 구현한다.

Sprint 2 진입 전 Sprint 1에서 확보해야 할 항목:
- Supabase `users` 테이블 정상 생성 확인
- Supabase 서버 클라이언트가 Route Handler에서 정상 동작하는 것 확인
- Next.js Middleware 파일 구조 파악 (`middleware.ts` 위치 결정)

---

*이 문서는 ROADMAP.md 및 PRD.md를 기반으로 작성된 Sprint 1 상세 계획서입니다.*
