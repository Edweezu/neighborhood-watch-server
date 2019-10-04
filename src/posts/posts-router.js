const express = require('express')
const PostsRouter = express.Router()
const jsonParser = express.json()
const requireAuth = require('../middleware/jwt-auth')
const PostService = require('./posts-service')
const path = require('path')
const logger = require('../logger')

PostsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        let db = req.app.get('db')

        return PostService.getAllPosts(db)
            .then(posts => {
                return res.json(posts.map(post => {
                    return PostService.serializePost(post)
                }))
            })
    })
    .post(jsonParser, (req, res, next) => {
        let db = req.app.get('db')
        let { subject, message, post_category, date_created } = req.body
        let newPost = {
            subject,
            message,
            post_category,
            date_created
        }

        for (let item in newPost) {
            if (!newPost[item]) {
                return res.status(400).json(`Please provide a value for ${item}`)
            }
        }

        //placeid , user_id
        newPost.user_id = req.user.id
        

        return PostService.addPost (db, newPost)
            .then(post => {
                return res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${post.id}`))
                    .json(PostService.serializePost(post))
            })
    })

PostsRouter
    .route('/:postid')
    .all(requireAuth)
    .delete((req, res, next) => {
        let { postid } = req.params
        let db = req.app.get('db')

        //remember to get postById first in here and chain promises. 
        return PostService.getPostById (db, postid)
            .then(post => {

                if (!post) {
                    return res.status(400).send(`Please provide a valid post`)
                }

                return PostService.deletePost (db, postid)
                    .then(data => {
                        logger.info(`post id ${postid} was deleted.`)
                        return res.status(204).end()
                    })
                    .catch(next)
            })
            .catch(next)
    })



module.exports = PostsRouter
