CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    place_id INTEGER REFERENCES places(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    image TEXT,
    likes INT DEFAULT 0
);
