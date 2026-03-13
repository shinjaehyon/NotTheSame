# 📜 Project: 상호이해도 게임 (Not the Same Person You Used to Know)

## 1. 프로젝트 개요
* **서비스 명:** 상호이해도 게임
* **핵심 가치:** 친구 간의 상호 이해도를 퀴즈로 풀고 랭킹으로 확인하는 소셜 게임
* **주요 흐름:** 1. **호스트:** 닉네임 입력 → 퀴즈 생성(기본/커스텀) → 고유 코드 생성 및 공유
    2. **게스트:** 접속 코드 입력 → 닉네임 설정 → 퀴즈 풀이 → 결과 및 랭킹 확인

## 2. 기술 스택 (Tech Stack)
* **Framework:** Next.js 14+ (App Router)
* **Language:** TypeScript
* **Database/Auth:** Supabase (PostgreSQL)
* **Styling:** Tailwind CSS, Shadcn/UI
* **State Management:** Zustand (Client-side)

## 3. 핵심 기능 상세

### A. UUID 기반 익명 인증 (Anonymous Auth)
* 별도의 소셜 로그인 없이 **닉네임 입력**만으로 시작.
* `crypto.randomUUID()`를 통해 고유 식별자를 생성하거나 DB의 UUID PK를 사용.
* 생성된 ID는 **HTTP-Only Cookie**에 저장하여 세션 유지.
* 쿠키가 없는 사용자가 퀴즈 페이지 접근 시 메인(이름 입력)으로 리다이렉트.

### B. 퀴즈 시스템 (Quiz Logic)
* **기본 문항:** 서비스에서 제공하는 고정 질문 10개 (예: 탕수육은 부먹 vs 찍먹).
* **커스텀 문항:** 사용자가 질문 내용과 선택지(최대 4개)를 직접 편집 및 추가 가능.
* **데이터 저장:** `Questions` 테이블에 호스트가 설정한 정답(index) 저장.

### C. 실시간 랭킹 (Ranking)
* 게스트가 제출을 완료하면 실시간으로 점수 계산 (정답 수 / 전체 문항 수 * 100).
* 해당 퀴즈 코드에 귀속된 전체 참여자 리스트를 점수 높은 순으로 정렬하여 표시.

## 4. 데이터베이스 스키마 (Database Schema)

### `users` 테이블
- `id`: uuid (PK, default: gen_random_uuid())
- `nickname`: text
- `created_at`: timestamp

### `quiz_rooms` 테이블
- `id`: uuid (PK)
- `access_code`: text (Unique, 6자리 영문/숫자 조합)
- `host_id`: uuid (FK -> users.id)
- `created_at`: timestamp

### `questions` 테이블
- `id`: uuid (PK)
- `room_id`: uuid (FK -> quiz_rooms.id)
- `question_text`: text
- `options`: jsonb (선택지 배열)
- `correct_index`: int (정답 번호)

### `responses` 테이블 (Ranking 데이터)
- `id`: uuid (PK)
- `room_id`: uuid (FK -> quiz_rooms.id)
- `guest_id`: uuid (FK -> users.id)
- `score`: int
- `completed_at`: timestamp

## 5. UI/UX 가이드라인
* **Main:** 심플한 닉네임 입력창과 [방 만들기], [참여하기] 버튼.
* **Quiz Page:** 모바일 환경을 고려한 카드 스와이프 또는 단계별 버튼 클릭 레이아웃.
* **Ranking:** 깔끔한 표(Table) 형태이며, 본인의 순위는 강조 표시.

## 6. 개발 우선순위 (Development Roadmap)
1. **Step 1:** 프로젝트 초기 설정 및 Supabase 연동.
2. **Step 2:** UUID 기반 익명 로그인(이름 입력 및 쿠키 저장) 로직 구현.
3. **Step 3:** 퀴즈 생성 UI 및 DB 저장 로직 (커스텀 기능 포함).
4. **Step 4:** 퀴즈 풀이 화면 및 정답 체크 로직.
5. **Step 5:** 결과 페이지 및 실시간 랭킹 리더보드 구현.