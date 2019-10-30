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
    .post((req, res, next) => {
        let db = req.app.get('db')
        const { text, post_id } = req.body
        const newComment = {
            text,
            post_id,
            date_created: JSON.stringify(new Date())
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

CommentsRouter
    .route('/:commentId')
    .all(requireAuth)
    .get((req, res, next) => {
        let { commentId } = req.params
        let db = req.app.get('db')
        
        return CommentsService.getById(db, commentId)
            .then(comment => {
                comment.user_logged_in = req.user.id
                if (!comment) {
                    return res.status(400).send(`Please provide a valid comment`)
                }
                return res.json(CommentsService.serializeComment(comment))
            })
            .catch(next)
    })
    .patch((req, res, next) => {
        let { commentId } = req.params
        let db = req.app.get('db')
        let { text } = req.body
        let newComment = {
            text
        }

        for (let item in newComment) {
            if (!newComment[item]) {
                return res.status(400).json(`Please provide a value for ${item}`)
            }
        }

        return CommentsService.updateComment(db, newComment, commentId)
            .then(comment => {   
                return CommentsService.getById(db, commentId)
                    .then(updatedComment => {
                        return res.json(CommentsService.serializeComment(updatedComment))
                    })
                    .catch(next)
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        let db = req.app.get('db')
        let { commentId } = req.params

        return CommentsService.getById (db, commentId)
            .then(comment => {
                if (!comment) {
                    return res.status(400).send(`Please provide a valid comment`)
                }

                return CommentsService.deleteComment(db, commentId)
                    .then(data => {
                        return res.status(204).end()
                    })
                    .catch(next)
            })
            .catch(next)
    })

module.exports = CommentsRouter