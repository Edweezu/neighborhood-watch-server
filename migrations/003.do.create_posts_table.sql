CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    place_id INTEGER REFERENCES places(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    image TEXT
);

-- router.post('/upload', function (req, res) {
--     upload(req, res, function (err) {
--         iconsole.log("Request ---", req.body);
--         console.log("Request file ---", req.file);//Here you get file.
--         /*Now do where ever you want to do*/
--         if(!err) {
--             return res.send(200).end();
--         }
--     })
-- })