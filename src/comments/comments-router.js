const express = require('express')
const CommentsRouter = express.Router()
const requireAuth = require('../middleware/jwt-auth')
const CommentsService = require('./comments-service')
const jsonParser = express.json()
const path = require('path')

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
    .post(jsonParser, (req, res, next) => {
        let db = req.app.get('db')
        const { text, post_id } = req.body
        const newComment = {
            text,
            post_id
        }

        for (let item in newComment) {
            if (!newComment[item]) {
                return res.status(400).json(`Please provide a value for the field ${item}`)
            }
        }

        newComment.user_id = req.user.id

        return CommentsService.postNewComment(db, newComment)
            .then(comment => {
                return res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `${comment.id}`))
                    .json(CommentsService.serializeComment(comment))
            })

    })



module.exports = CommentsRouter