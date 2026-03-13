# Sprint 6 — 1인 1방 제한 + 기본문항 공유 + 수정 기능 + 홈 버튼

**기간:** 2026-03-13
**상태:** ✅ 완료

---

## 목표

테스트 후 추가된 요건을 구현:
1. 유저당 퀴즈 방 하나만 생성 가능 (1인 1방 제한)
2. 이미 방이 있으면 홈에서 "내 답변 보기" 버튼으로 수정 진입
3. 기본 10문항은 코드에서 공유, DB에는 커스텀 문항만 저장
4. 결과/완성 페이지에 "홈으로" 버튼 추가

---

## 핵심 설계 결정

### D1: 기본 문항 공유 방식
- 기본 10문항(`src/lib/questions.ts`)은 DB에 저장하지 않음
- 호스트의 기본문항 정답 선택은 `quiz_rooms.default_answers` (jsonb, `number[]`) 에 저장
- 퀴즈 플레이 시 가상 ID `"default-0"` ~ `"default-9"` 부여하여 커스텀 문항과 병합
- 점수 계산: 기본문항은 `default_answers[N]`과 비교, 커스텀은 DB `correct_index`와 비교

### D2: 1인 1방 제한
- `quiz_rooms(host_id)` UNIQUE 제약 추가 (DB 마이그레이션 002)
- create API에서 기존 방 존재 시 409 + `accessCode` 반환

### D3: 홈 페이지 분기
- `page.tsx`를 async Server Component로 전환
- `cookies()`로 `user_id` 읽어 Supabase에서 기존 방 조회
- 방 있으면: "내 답변 보기" 버튼 (`/quiz/create?edit=CODE`) 표시
- 방 없으면: 기존 UI 유지

### D4: 수정 플로우
- `/quiz/create?edit=CODE` → 기존 create 페이지 재활용
- `useSearchParams()`로 edit 모드 감지 (Suspense 래퍼 추가)
- `GET /api/quiz/[code]/edit-data` 로 기존 데이터 로드
- 저장 시 `PUT /api/quiz/update` 호출

---

## 변경 파일 요약

| 파일 | 작업 |
|------|------|
| `src/lib/utils.ts` | `isValidUUID` 공통 유틸 추출 |
| `supabase/migrations/002_one_room_shared_defaults.sql` | `default_answers` 컬럼 + UNIQUE 제약 |
| `src/app/api/quiz/create/route.ts` | 신규 포맷 + 1인 1방 체크 |
| `src/app/api/quiz/update/route.ts` | 신규: 수정 PUT 핸들러 |
| `src/app/api/quiz/[code]/edit-data/route.ts` | 신규: 수정 데이터 조회 GET |
| `src/app/api/quiz/[code]/questions/route.ts` | 기본문항 가상 ID 병합 반환 |
| `src/app/api/quiz/submit/route.ts` | 기본/커스텀 혼합 점수 계산 |
| `src/app/api/result/[code]/route.ts` | totalCount = 10 + 커스텀 수 |
| `src/app/page.tsx` | async Server Component, 방 존재 시 분기 |
| `src/app/quiz/create/page.tsx` | edit 모드 + Suspense + 홈으로 버튼 |
| `src/app/result/[code]/page.tsx` | 홈으로 버튼 추가 |
| `tests/sprint4.spec.ts` | API 포맷 변경, S4-4 while 루프 |
| `tests/sprint5.spec.ts` | API 포맷 변경 |
| `tests/sprint6.spec.ts` | 신규 E2E 테스트 6개 |

---

## 완료 기준 (Definition of Done)

- [v] `supabase/migrations/002_...sql` — `default_answers` 컬럼 + UNIQUE 제약
- [v] 방 생성 API: `{ defaultAnswers, customQuestions }` 형태, 1인 1방 체크
- [v] 방 수정 API: `PUT /api/quiz/update`
- [v] 수정 데이터 조회 API: `GET /api/quiz/[code]/edit-data`
- [v] 문항 조회: 기본 10문항 가상 ID + 커스텀 문항 병합
- [v] 제출 API: 기본문항 `answers["default-N"]` 비교 로직
- [v] 결과 API: totalCount = 10 + 커스텀 수
- [v] 홈 페이지: 방 있을 때 "내 답변 보기" 버튼
- [v] 퀴즈 완성/수정 페이지: "홈으로" 버튼
- [v] 결과 페이지: "홈으로" 버튼
- [v] 기존 테스트 (sprint3~5) 신규 API 포맷 반영
- [v] Sprint6 E2E 테스트 6개 작성

---

## DB 마이그레이션 적용

Supabase 대시보드 SQL 에디터 또는 CLI에서 실행:

```sql
-- supabase/migrations/002_one_room_shared_defaults.sql
ALTER TABLE quiz_rooms ADD COLUMN default_answers jsonb NOT NULL DEFAULT '[]';
ALTER TABLE quiz_rooms ADD CONSTRAINT quiz_rooms_host_id_unique UNIQUE (host_id);
```
