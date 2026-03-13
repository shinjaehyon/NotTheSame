## 프로젝트 개요

**상호이해도 게임 (NotTheSame)** — 친구 간의 상호 이해도를 퀴즈로 풀고 랭킹으로 확인하는 소셜 게임. 호스트가 퀴즈 방을 만들어 접속 코드를 공유하면, 게스트가 참여해 퀴즈를 풀고 랭킹을 확인한다.

전체 기획 문서: `docs/PRD.md`

## 기술 스택

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database/Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Shadcn/UI
- **State Management:** Zustand (클라이언트 전용)

## 주요 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run lint         # 린터 실행
```

## 코드 스타일
- TypeScript strict 모드 사용, `any` 타입 금지
- default export 대신 named export 사용
- CSS: Tailwind 유틸리티 클래스 사용, 커스텀 CSS 파일 금지

## 아키텍처

### 핵심 플로우
1. 호스트: 닉네임 입력 → 퀴즈 생성(기본 10문항 + 커스텀) → 6자리 접속 코드 발급
2. 게스트: 접속 코드 입력 → 닉네임 설정 → 퀴즈 풀이 → 랭킹 확인

### 인증
UUID 기반 익명 인증(소셜 로그인 없음). 생성된 ID는 HTTP-Only 쿠키에 저장. 쿠키가 없는 사용자는 메인(닉네임 입력) 페이지로 리다이렉트.

### 데이터베이스 스키마 (Supabase)
상세 스키마는 `docs/PRD.md` §4 참고

### 점수 계산
점수 = (정답 수 / 전체 문항 수) × 100, 퀴즈 방 단위로 내림차순 정렬.

## UI 가이드라인
- 모바일 우선: 퀴즈 화면은 카드 스와이프 또는 단계별 버튼 클릭 레이아웃
- 랭킹은 표(Table) 형태, 본인 순위 강조 표시

## 중요 사항
- docs/ 폴더를 항상 참조할것
- env 파일은 git 커밋 제외

