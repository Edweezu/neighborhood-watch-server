TRUNCATE users RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, first_name, last_name, country, state, city, email, occupation) 
VALUES
('joeschmoe89', 'Testing123!', 'John', 'Schmoe', 'Indonesia', 'Bali', 'Denpansar', 'test3@gmail.com', 'writer'),
('tommyspace', 'Testing124!', 'Tom', '', 'United States', 'New York', 'New York', 'test4@gmail.com', 'business owner'),
('johndoe22', 'Testing125!', 'John', 'Doe', 'United States', 'California', 'San Francisco', 'test2@gmail.com', 'engineer'),
('edweezu', 'Testing126!', 'Ed', 'Q', 'United States', 'California', 'Santa Monica', 'test@gmail.com', 'student'
),
('demo', 'Testing123!', 'demo', 'test', 'United States', 'California', 'Santa Monica', 'demo@gmail.com', 'student'
);
