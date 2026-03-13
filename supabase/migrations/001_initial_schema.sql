-- 001_initial_schema.sql
-- 상호이해도 게임 초기 스키마

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
