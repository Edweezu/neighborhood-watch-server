TRUNCATE places, posts, comments RESTART IDENTITY CASCADE;

INSERT INTO places (country, state, city) VALUES 
('Indonesia', 'Bali', 'Denpansar'),
('United States', 'New York', 'New York'),
('United States', 'California', 'San Francisco'),
('United States', 'California', 'Santa Monica'),
('China', 'Guangdong', 'Guangdong'),
('France', 'lle-de-France', 'Paris');

INSERT INTO posts (subject, message, date_created, post_category, place_id, user_id) VALUES
('Crime Number 1', 'This is the text for Crime #1', now() - '21 days'::INTERVAL, 'Crime and Alerts', 1, 1),
('Crime Number 2', 'This is the text for Crime #2', now() - '12 days'::INTERVAL, 'Crime and Alerts', 2, 2),
('Crime Number 2', 'This is the text for Crime #2', now() - '10 days'::INTERVAL, 'Crime and Alerts', 2, 2),
('Crime Number 3', 'This is the text for Crime #3', now() - '8 days'::INTERVAL, 'Crime and Alerts', 3, 3),
('Crime Number 4', 'This is the text for Crime #4', now() - '22 days'::INTERVAL, 'Crime and Alerts', 4, 4),
('Event Number 1', 'This is the text for Event #1', now() - '2 days'::INTERVAL, 'Upcoming Events', 2, 2),
('Event Number 2', 'This is the text for Event #2', now() - '28 days'::INTERVAL, 'Upcoming Events', 3, 3),
('Event Number 3', 'This is the text for Event #3', now() - '11 days'::INTERVAL, 'Upcoming Events', 1, 1),
('Event Number 4', 'This is the text for Event #4', now() - '8 days'::INTERVAL, 'Upcoming Events', 4, 4),
('Lost and Found Number 1', 'This is the text for Lost and Found #1', now() - '5 days'::INTERVAL, 'Lost and Found', 3, 3),
('Lost and Found Number 2', 'This is the text for Lost and Found #2', now() - '4 days'::INTERVAL,  'Lost and Found', 1, 1),
('Lost and Found Number 3', 'This is the text for Lost and Found #3', now() - '17 days'::INTERVAL, 'Lost and Found', 4, 4),
('Lost and Found Number 4', 'This is the text for Lost and Found #4', now() - '15 days'::INTERVAL, 'Lost and Found', 2, 2);

INSERT INTO comments (text, date_created, user_id, post_id) VALUES 
('Random Comment 1', now() - '9 days'::INTERVAL, 1, 12),
('Random Comment 2', now() - '10 days'::INTERVAL, 2, 11),
('Random Comment 3', now() - '2 days'::INTERVAL, 3, 10),
('Random Comment 4', now() - '3 days'::INTERVAL, 4, 9),
('Random Comment 5', now() - '6 days'::INTERVAL, 1, 8),
('Random Comment 6', now() - '8 days'::INTERVAL, 2, 7),
('Random Comment 7', now() - '23 days'::INTERVAL, 3, 6),
('Random Comment 8', now() - '1 days'::INTERVAL, 4, 5),
('Random Comment 9', now() - '18 days'::INTERVAL, 1, 4),
('Random Comment 10', now() - '6 days'::INTERVAL, 2, 3),
('Random Comment 11', now() - '8 days'::INTERVAL, 3, 2),
('Random Comment 12', now() - '19 days'::INTERVAL, 4, 1);