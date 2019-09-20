CREATE TYPE post_category AS ENUM (
    'All-Posts',
    'Crime and Alerts',
    'Upcoming Events',
    'Lost and Found'
);

ALTER TABLE posts 
    ADD COLUMN
        post_category post_category;