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
// const formData = require('express-form-data')


const app = express()

const morganOption = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(cors())
// app.options('*', cors());
app.use(helmet({hidePoweredBy: {setTo: 'bye'}}));
// app.use(urlencoded({ extended: false }));
// app.use(json());
// app.use(cloudinaryConfig)
// app.use(formData.parse())

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.get('/test', (req, res) => {
    res.send('Hello world2!')
})

app.use('/api/users', UsersRouter)
app.use('/api/posts', PostsRouter)
app.use('/api/places', PlacesRouter)
app.use('/api/comments', CommentsRouter)

app.use(ErrorHandler)

module.exports = app