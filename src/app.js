require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const NODE_ENV = require('./config').NODE_ENV
const ErrorHandler = require('./errorhandler')
const UsersRouter = require('./users/users-router')
const PostsRouter = require('./posts/posts-router')
const PlacesRouter = require('./places/places-router')
const CommentsRouter = require('./comments/comments-router')
const { cloudinaryConfig, uploader } = require('./cloudinaryConfig')
const { urlencoded, json } = require('body-parser')
const path = require('path')


const app = express()

const morganOption = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet({hidePoweredBy: {setTo: 'bye'}}));
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cloudinaryConfig)

app.get('/', (req, res) => {
    res.send('Hello world!')
})


app.use('/api/users', UsersRouter)
app.use('/api/posts', PostsRouter)
app.use('/api/places', PlacesRouter)
app.use('/api/comments', CommentsRouter)

if (process.env.NODE_ENV === 'production') {
    app.use('/api/posts', express.static("build"))
    app.use('/api/users', express.static("build"))
    app.use('/api/places', express.static("build"))
    app.use('/api/comments', express.static("build"))

    app.get("*", (req, res) => {
        res.sendfile(path.resolve(__dirname,  "build", "index.html"));
    });
}

app.use(ErrorHandler)

module.exports = app