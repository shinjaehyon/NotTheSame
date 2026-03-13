# Sprint 4 — 퀴즈 풀이 화면 + 정답 체크

**기간:** 2026-03-13 15:49 ~ 16:20
**상태:** ✅ 완료

## 목표
게스트가 6자리 접속 코드로 퀴즈 방에 입장하고, 문항을 단계별로 풀고, 답변을 DB에 저장한다.

## 구현 내역

### 변경 파일
- `src/app/page.tsx` — `참여하기` 버튼을 `<Link role="button" href="/quiz/join">`으로 변경 (form 외부 분리)

### 신규 파일
- `src/app/quiz/join/page.tsx` — 접속 코드 입력 + 오류 표시
- `src/app/api/quiz/join/route.ts` — POST: access_code 검증 → roomId 반환
- `src/app/quiz/[code]/page.tsx` — 단계별 퀴즈 풀이 (progress-bar, question-index, option-N)
- `src/app/api/quiz/[code]/questions/route.ts` — GET: 문항 조회 (correct_index 노출 제외)
- `src/app/api/quiz/submit/route.ts` — POST: 점수 계산 + responses INSERT
- `src/app/result/[code]/page.tsx` — 결과 페이지 placeholder (Sprint 5 준비)
- `tests/sprint4.spec.ts` — Playwright E2E 테스트

### 주요 설계 결정
- `참여하기` 버튼을 Link로 분리: 게스트는 닉네임 없이 접속 코드로만 입장 → join 페이지에서 처리
- `role="button"` 명시: `<a>` 태그에 `role="button"` 추가로 Playwright `getByRole('button')` 매칭
- `correct_index` 보안: questions API는 `correct_index` 제외하여 반환, 점수 계산은 서버 submit API에서만 수행
- 점수 공식: `Math.round((정답 수 / 전체 문항 수) × 100)`
- S4-3/S4-4 테스트용 방 분리: S4-3은 2문항 방(다음 버튼 필요), S4-4는 1문항 방(제출하기 버튼 즉시 노출) — `beforeAll`에서 각각 생성
- S4-4 로딩 대기: `progress-bar` visible 확인 후 questionCount 측정 (useEffect 비동기 fetch 완료 보장)

## 테스트 결과
- S4-1: 유효한 접속 코드로 입장 → /quiz/[code] URL 이동 ✅
- S4-2: 잘못된 접속 코드 → "존재하지 않는 퀴즈 코드입니다" 표시 ✅
- S4-3: 문항 단계별 진행 + progress-bar + question-index "2 /" 확인 ✅
- S4-4: 전체 제출 후 /result/[code] 이동 ✅
- 전체 26/26 통과 (Sprint 1~4, chromium + Mobile Chrome)
