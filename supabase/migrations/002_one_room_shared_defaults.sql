-- Sprint 6: 1인 1방 제한 + 기본문항 공유 (default_answers)
ALTER TABLE quiz_rooms ADD COLUMN default_answers jsonb NOT NULL DEFAULT '[]';
ALTER TABLE quiz_rooms ADD CONSTRAINT quiz_rooms_host_id_unique UNIQUE (host_id);
