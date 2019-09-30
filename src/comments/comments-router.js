const express = require('express')
const CommentsRouter = express.Router()
const requireAuth = require('../middleware/jwt-auth')
const CommentsService = require('./comments-service')

CommentsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        let db = req.app.get('db')

        return CommentsService.getAllComments(db)
            .then(comments => {
                return res.json(comments.map(comment => {
                    return CommentsService.serializeComment(comment)
                }))
            })
    })


module.exports = CommentsRouter