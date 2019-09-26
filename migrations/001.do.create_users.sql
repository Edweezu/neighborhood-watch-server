CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    country TEXT,
    state TEXT,
    cityinput TEXT,
    email TEXT,
    occupation TEXT
);