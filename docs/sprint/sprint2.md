# Sprint 2 — UUID 기반 익명 인증 + 세션 관리

**기간:** 2026-03-13
**상태:** ✅ 완료

## 목표
닉네임 입력만으로 UUID를 생성해 users 테이블에 저장하고, HTTP-Only 쿠키로 세션을 유지한다. 미인증 사용자는 /quiz/* 접근 시 홈으로 리다이렉트된다.

## 구현 내역

### 변경 파일
- `src/app/page.tsx` — 닉네임 입력 폼 (HTML form POST, 서버 컴포넌트)
- `src/app/api/auth/register/route.ts` — 사용자 생성 + HTTP-Only 쿠키 설정 + 리다이렉트
- `src/middleware.ts` — `/quiz/*` 미인증 접근 차단
- `src/components/ui/input.tsx` — Shadcn Input 컴포넌트 추가
- `tests/sprint2.spec.ts` — Playwright E2E 테스트
- `docs/ROADMAP.md` — Sprint 2 완료 처리

### 주요 설계 결정
- 전통적인 HTML form POST + 서버 리다이렉트 방식 채택
  - 이유: `useFormState` (fetch 기반) 방식은 Playwright의 `click()` 네비게이션 대기가 작동하지 않음
  - HTML form POST는 전체 페이지 네비게이션이므로 Playwright가 완료까지 대기
- 오류는 URL 쿼리 파라미터(`?error=nickname`)로 전달 후 서버 컴포넌트에서 렌더링
- 쿠키: httpOnly, sameSite=lax, 30일 만료

## 테스트 결과
- S2-1: 닉네임 입력 후 user_id 쿠키(httpOnly) 생성 확인 ✅
- S2-2: 쿠키 없이 /quiz/create 접근 시 / 리다이렉트 ✅
- S2-3: 닉네임 빈 값 제출 시 오류 메시지 표시 ✅
- 전체 10/10 통과 (Sprint 1 포함)
