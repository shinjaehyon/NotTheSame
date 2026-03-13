# Sprint 3 — 퀴즈 생성 UI + DB 저장

**기간:** 2026-03-13 15:28 ~ 16:49
**상태:** ✅ 완료

## 목표
호스트가 기본 10문항을 확인하고 커스텀 문항을 추가하여 퀴즈를 완성하면 6자리 접속 코드가 발급된다.

## 구현 내역

### 신규 파일
- `src/lib/questions.ts` — 한국 문화 기반 기본 10문항 데이터
- `src/app/quiz/create/page.tsx` — 퀴즈 생성 UI (기본 문항 정답 선택 + 커스텀 문항 CRUD + 코드 발급 화면)
- `src/app/api/quiz/create/route.ts` — 6자리 코드 생성(중복 방지) + quiz_rooms/questions INSERT
- `tests/sprint3.spec.ts` — Playwright E2E 테스트

### 주요 설계 결정
- `done` 상태를 클라이언트 state(`setPhase("done")`)로 처리 — fetch 후 accessCode 표시
- UUID 유효성 검사: 정규식으로 UUID 형식 확인 후 비정상 값(e.g. 'test-uuid-host')은 새 user INSERT
- 접속 코드 생성: 6자리 대문자+숫자 랜덤 생성, 최대 10회 재시도로 중복 방지
- 커스텀 문항 CRUD: 인라인 폼(질문 + 선택지 1~4 + 라디오 정답 선택) → "저장" 시 목록에 추가

## 테스트 결과
- S3-1: 기본 문항 10개 표시 확인 ✅
- S3-2: 커스텀 문항 추가 후 텍스트 노출 ✅
- S3-3: 퀴즈 완성하기 → access-code 6자리 확인 ✅
- S3-4: 퀴즈 완성하기 → 복사 → 클립보드 확인 ✅
- 전체 18/18 통과 (Sprint 1+2+3, chromium + Mobile Chrome)
