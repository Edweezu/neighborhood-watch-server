CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    email TEXT,
    occupation TEXT,
    interests TEXT,
    image TEXT,
    nothing TEXT,
    make_private BOOLEAN DEFAULT FALSE
);