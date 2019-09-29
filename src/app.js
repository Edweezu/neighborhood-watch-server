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



const app = express()

const morganOption = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet({hidePoweredBy: {setTo: 'bye'}}));

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.use('/api/users', UsersRouter)
app.use('/api/posts', PostsRouter)
app.use('/api/places', PlacesRouter)

app.use(ErrorHandler)

module.exports = app