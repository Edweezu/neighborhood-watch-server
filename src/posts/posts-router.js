require('dotenv').config()
const express = require('express')
const PostsRouter = express.Router()
const jsonParser = express.json()
const requireAuth = require('../middleware/jwt-auth')
const PostService = require('./posts-service')
const path = require('path')
const logger = require('../logger')
// const cloudinary = require('cloudinary')
const { multerUploads, dataUri } = require('../middleware/multerUploads')
const { uploader, cloudinaryConfig } = require('../cloudinaryConfig')


// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.API_KEY, 
//     api_secret: process.env.API_SECRET
// })


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
    .post(multerUploads, (req, res, next) => {

        console.log('req files', req.file)
        console.log('req body', req.body)
        let db = req.app.get('db')
        let { subject, message, post_category, place_id } = req.body

        let newPost = {
            subject,
            message,
            post_category,
            date_created: JSON.stringify(new Date()),
            place_id
        }

        console.log('new post', newPost)

        for (let item in newPost) {
            if (!newPost[item]) {
                return res.status(400).json(`Please provide a value for ${item}`)
            }
        }

        //placeid , user_id
        newPost.user_id = req.user.id
        
        if (req.file) {
            const file = dataUri(req).content;
            return uploader.upload(file).then((result) => {
                const image = result.url;
                newPost.image = image

                return PostService.addPost (db, newPost)
                .then(post => {
                    console.log('post service post', post)
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
                    console.log('post service post', post)
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

                return res.json(PostService.serializePost(post))
            })
    })
    .patch(multerUploads, (req, res, next) => {
        let { postid } = req.params

        console.log('req files', req.file)
        console.log('req body', req.body)
        let db = req.app.get('db')
        let { subject, message, post_category, place_id } = req.body

        let updatedPost = {
            subject,
            message,
            post_category,
            place_id,
        }

        console.log('new post', updatedPost)

        for (let item in updatedPost) {
            if (!updatedPost[item]) {
                return res.status(400).json(`Please provide a value for ${item}`)
            }
        }
        
        //placeid , user_id
        
        if (req.file) {
            const file = dataUri(req).content;
            return uploader.upload(file).then((result) => {
                const image = result.url;
                updatedPost.image = image

                return PostService.updatePost (db, updatedPost, postid)
                .then(post => {
                    
                   return PostService.getById(db, postid)
                    .then(post => {
                        console.log('returned updated post', post)
                        return res
                        .json(PostService.serializePost(post))
                    })
                })
                .catch(next)

            })
            .catch(next)
        } else if (!req.file) {
            updatedPost.image = null
            return PostService.updatePost (db, updatedPost, postid)
                .then(post => {
                    
                   return PostService.getById(db, postid)
                    .then(post => {
                        console.log('returned updated post', post)
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


PostsRouter
    .route('/image')
    // .all(requireAuth)
    .post(jsonParser, (req,res, next) => {
        console.log('hi')
        console.log('req files', req.files)
        const path = Object.values(Object.values(req.files)[0])[0].path

        cloudinary.uploader.upload(path)
            .then(image => res.json([image]))
    })


module.exports = PostsRouter
