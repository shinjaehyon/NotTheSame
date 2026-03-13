# NotTheSame — 상호이해도 게임

친구가 나를 얼마나 아는지 퀴즈로 확인하는 소셜 게임.
호스트가 자신에 대한 퀴즈를 만들고 접속 코드를 공유하면, 친구들이 참여해 풀고 랭킹을 확인한다.

---

## 주요 기능

- **퀴즈 방 생성** — 호스트가 기본 10문항 정답을 선택하고, 커스텀 문항을 추가해 6자리 접속 코드 발급
- **1인 1방 제한** — 유저당 방 하나만 생성 가능, 기존 방은 언제든지 수정 가능
- **퀴즈 풀기** — 게스트가 접속 코드 입력 후 단계별로 문항을 풀고 제출
- **실시간 랭킹** — 제출 즉시 Supabase Realtime으로 랭킹 자동 갱신
- **익명 인증** — 소셜 로그인 없이 닉네임만으로 참여, UUID 기반 HTTP-Only 쿠키 세션

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Database / Auth | Supabase (PostgreSQL + Realtime) |
| Styling | Tailwind CSS + Shadcn/UI |
| State | Zustand (클라이언트 전용) |
| Test | Playwright E2E |

---

## 로컬 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Supabase 프로젝트 정보를 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### 3. DB 마이그레이션 적용

Supabase 대시보드 > SQL Editor에서 `supabase/migrations/` 내 파일을 순서대로 실행:

```
001_initial_schema.sql
002_one_room_shared_defaults.sql
```

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

---

## 주요 명령어

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # 린터
npx playwright test               # E2E 전체 테스트
npx playwright test tests/sprint6.spec.ts  # 특정 스프린트 테스트
```

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx                  # 홈 (방 만들기 / 내 답변 보기)
│   ├── quiz/
│   │   ├── create/page.tsx       # 퀴즈 생성 & 수정
│   │   ├── join/page.tsx         # 접속 코드 입력
│   │   └── [code]/page.tsx       # 퀴즈 풀기
│   ├── result/[code]/page.tsx    # 결과 & 실시간 랭킹
│   └── api/
│       ├── auth/register/        # 닉네임 등록 + 쿠키 발급
│       ├── quiz/create/          # 방 생성 (POST)
│       ├── quiz/update/          # 방 수정 (PUT)
│       ├── quiz/[code]/questions/ # 문항 조회
│       ├── quiz/[code]/edit-data/ # 수정용 데이터 조회
│       ├── quiz/submit/          # 퀴즈 제출 + 점수 계산
│       └── result/[code]/        # 랭킹 조회
├── lib/
│   ├── questions.ts              # 기본 10문항 (코드 공유)
│   └── utils.ts                  # cn, isValidUUID
supabase/migrations/              # DB 스키마 마이그레이션
docs/
├── PRD.md                        # 기획 문서
├── ROADMAP.md                    # 스프린트 로드맵
└── sprint/                       # 스프린트별 상세 문서
tests/                            # Playwright E2E 테스트
```

---

## DB 스키마 요약

```
users          — id (uuid), nickname
quiz_rooms     — id, access_code (6자리), host_id, default_answers (jsonb)
questions      — id, room_id, question_text, options (jsonb), correct_index
responses      — id, room_id, guest_id, score
```

> 기본 10문항은 `src/lib/questions.ts`에서 코드로 공유되며 DB에 저장하지 않습니다.
> 커스텀 문항만 `questions` 테이블에 저장됩니다.

---

## 점수 계산

```
점수 = (정답 수 / 전체 문항 수) × 100
전체 문항 수 = 기본 10문항 + 커스텀 문항 수
```
