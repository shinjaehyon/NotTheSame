# Sprint 5 — 결과 페이지 + 실시간 랭킹 리더보드

**기간:** 2026-03-13 16:20 ~ 16:52
**상태:** ✅ 완료

## 목표
제출 후 본인 점수와 전체 랭킹을 확인. 본인 순위 강조 표시. Supabase Realtime으로 자동 갱신.

## 구현 내역

### 신규 파일
- `src/app/api/result/[code]/route.ts` — GET: responses + users JOIN으로 랭킹 조회, 본인 점수 포함
- `tests/sprint5.spec.ts` — Playwright E2E 테스트

### 변경 파일
- `src/app/result/[code]/page.tsx` — placeholder → 완전 구현 (점수, 랭킹 테이블, Realtime)
- `playwright.config.ts` — `fullyParallel: false`, `workers: 1`, `retries: 1` (안정성 개선)

### 주요 설계 결정
- **랭킹 API**: 2-step 조회 (responses → users in 필터로 닉네임 일괄 조회) — FK 자동 관계 감지 우회
- **본인 식별**: 쿠키 `user_id`가 UUID 형식일 때만 `myGuestId` 반환, 비형식 값(test-uuid-*) 은 null
- **테스트 UUID 전략**: 고정 UUID `a0000000-...-0001` 사용 → isValidUUID 통과 → 본인 행 강조 정상 동작
- **Realtime + 폴링 fallback**: Supabase Realtime INSERT 이벤트 구독 + 3초 폴링으로 미지원 환경 대응
- **본인 행 강조**: `className="font-bold highlight ..."` — Playwright `toHaveClass(/font-bold/)` 통과
- **S5-4 두 번째 게스트**: `a0000000-...-0002`로 별도 submit → `rank-row` count 증가 확인

## 테스트 결과
- S5-1: 결과 페이지 점수(my-score, correct-count) 표시 확인 ✅
- S5-2: 랭킹 테이블 점수 내림차순 정렬 확인 ✅
- S5-3: 본인 순위 강조 표시(font-bold) 확인 ✅
- S5-4: 두 번째 게스트 제출 후 rank-row 실시간 증가 확인 ✅
- 전체 34/34 통과 (Sprint 1~5, chromium + Mobile Chrome)
