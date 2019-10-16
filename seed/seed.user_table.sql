TRUNCATE users RESTART IDENTITY CASCADE;

INSERT INTO users (username, password, first_name, last_name, country, state, city, email, occupation) 
VALUES
('demo', '$2a$10$t7W0xeI/NfL0uwIvWV0la.8Bv.xc2tXSi05ORVt5lvx1JsimjR/2O', 'Foo', 'Bar', 'United States', 'California', 'Santa Monica', 'demo@gmail.com', 'student'
),
('joeschmoe89', '$2a$10$g0U8f1wLI0NFKBg5g5mXoe5goIyEfSHZRKrxPtGRHVo7ITleLsrdm', 'John', 'Schmoe', 'Indonesia', 'Bali', 'Denpansar', 'test3@gmail.com', 'writer'),
('tommyspace', '$2a$10$DDUbaN3XUmZCCm8BcLOaKOOhb.QktZE45m2KR/W/6JSNuZ0rhvvyu', 'Tom', '', 'United States', 'New York', 'New York', 'test4@gmail.com', 'business owner'),
('johndoe22', '$2a$10$Cy6LPTxvIv24Xlf2XY.qEuD0njPlAI3PmG7NtfVuQvoKWGjotBjkK', 'John', 'Doe', 'United States', 'California', 'San Francisco', 'test2@gmail.com', 'engineer'),
('edweezu', '$2a$10$OVb3EGu5RjIx06FD1VyICOhUjkmandVXnSRhOo2D1AzTPQKvlWh0O', 'Ed', 'Q', 'United States', 'California', 'Santa Monica', 'test@gmail.com', 'student'
);


