ALTER TABLE IF EXISTS posts
    DROP COLUMN user_id;

ALTER TABLE IF EXISTS posts
    DROP COLUMN place_id;

DROP TABLE IF EXISTS posts;