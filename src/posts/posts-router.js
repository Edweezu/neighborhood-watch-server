require('dotenv').config()
const express = require('express')
const PostsRouter = express.Router()
const jsonParser = express.json()
const requireAuth = require('../middleware/jwt-auth')
const PostService = require('./posts-service')
const path = require('path')
const logger = require('../logger')
const cloudinary = require('cloudinary').v2
const { multerUploads, dataUri } = require('../middleware/multerUploads')
const { uploader, cloudinaryConfig } = require('../cloudinaryConfig')
const moment = require('moment')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET
})


PostsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        let db = req.app.get('db')

        return PostService.getAllPosts(db)
            .then(posts => {
                return res.json(posts.map(post => {
                    post.logged_user = req.user.id
                    return PostService.serializePost(post)
                }))
            })
    })
    .post(multerUploads, (req, res, next) => {
        let db = req.app.get('db')
        let { subject, message, post_category, place_id } = req.body

        let newPost = {
            subject,
            message,
            post_category,
            date_created: JSON.stringify(new Date()),
            place_id
        }

        for (let item in newPost) {
            if (!newPost[item]) {
                return res.status(400).json(`Please provide a value for ${item}`)
            }
        }

        newPost.user_id = req.user.id
        
        if (req.file) {
            const file = dataUri(req).content;
            return cloudinary.uploader.upload(file).then((result) => {
                const image = result.url;
                newPost.image = image

                return PostService.addPost (db, newPost)
                .then(post => {
                    post.logged_user = req.user.id
                    return res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${post.id}`))
                        .json(PostService.serializePost(post))
                })
                .catch(next)

            })
            .catch(next)
        } else if (!req.file) {
            return PostService.addPost (db, newPost)
                .then(post => {
                    post.logged_user = req.user.id
                    return res
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${post.id}`))
                        .json(PostService.serializePost(post))
                })
                .catch(next)
        }      
    })

PostsRouter
    .route('/:postid')
    .all(requireAuth)
    .get((req, res, next) => {
        let { postid } = req.params
        let db = req.app.get('db')

        return PostService.getById (db, postid)
            .then(post => {
                if (!post) {
                    return res.status(400).send(`Please send a valid post.`)
                }
                //need to set logged_user as the current user for every serialize post function
                post.logged_user = req.user.id

                return res.json(PostService.serializePost(post))
            })
            .catch(next)
    })
    .patch(multerUploads, (req, res, next) => {
        let { postid } = req.params
        let db = req.app.get('db')
        let { subject, message, post_category, place_id, likes } = req.body

        let updatedPost = {}

        for (let item in req.body) {
            if (req.body[item] !== null && req.body[item] !== '') {
                updatedPost[item] = req.body[item]
            }
        }

        
        if (req.file) {
            const file = dataUri(req).content;
            return uploader.upload(file).then((result) => {
                const image = result.url;
                updatedPost.image = image

                return PostService.updatePost (db, updatedPost, postid)
                .then(post => {
                   return PostService.getById(db, postid)
                    .then(post => {
                        post.logged_user = req.user.id
                        return res
                        .json(PostService.serializePost(post))
                    })
                })
                .catch(next)
            })
            .catch(next)

        } else if (!req.file) {
            return PostService.updatePost (db, updatedPost, postid)
                .then(post => {
                   return PostService.getById(db, postid)
                    .then(post => {
                        post.logged_user = req.user.id
                        return res
                        .json(PostService.serializePost(post))
                    })
                })
                .catch(next)
        }
    })
    .delete((req, res, next) => {
        let { postid } = req.params
        let db = req.app.get('db')

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

PostsRouter
    .route('/:postid/likes')
    .all(requireAuth)
    .get((req, res, next) => {
        let { postid } = req.params
        let db = req.app.get('db')

        return PostService.getAllLikes(db, postid)
            .then(list => {
                return res.json(list)
            })
    })
    .post((req, res, next) => {
        let db = req.app.get('db')
        let { postid } = req.params

        let newLike = {
            post_id: postid,
            user_id: req.user.id
        }

        return PostService.checkUserLikes(db, postid, req.user.id)
            .then(user => {
                if (user.length) {
                    return res.status(400).send(`User already liked`)
                }
                return PostService.postUserLike(db, newLike)
                    .then(newLike => {
                        return PostService.getAllLikes(db, postid)
                            .then(list => {
                                return res.json(list)
                            })
                    })
            })
    })
    .delete((req, res, next) => {
        let db = req.app.get('db')
        let { postid } = req.params

        return PostService.deleteUserLike(db, postid, req.user.id)
            .then(data => {
                return PostService.getAllLikes(db, postid)
                    .then(list => {
                        return res.json(list)
                    })
            })
    })


PostsRouter
    .route('/image')
    .post(jsonParser, (req,res, next) => {
      
        const path = Object.values(Object.values(req.files)[0])[0].path

        cloudinary.uploader.upload(path)
            .then(image => res.json([image]))
    })


module.exports = PostsRouter
