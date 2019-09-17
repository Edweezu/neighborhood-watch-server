CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    city TEXT NOT NULL,
    email TEXT NOT NULL,
    occupation TEXT,
    interests TEXT
);