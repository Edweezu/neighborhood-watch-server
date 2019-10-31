const express = require('express')
const path = require('path')
const UsersRouter = express.Router()
const jsonParser = express.json()
const UsersService = require('./users-service')
const xss = require('xss')
const requireAuth = require('../middleware/jwt-auth')
const { multerUploads, dataUri } = require('../middleware/multerUploads')
const { uploader, cloudinaryConfig } = require('../cloudinaryConfig')


UsersRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        let db = req.app.get('db')
        return UsersService.getAllUsers(db)
            .then(users => {
                return res.json(users.map(user => {
                    return (UsersService.serializeGetAllUser(user))
                }))
            })
            .catch(next)
    })



UsersRouter
    .route('/login')
    .post(jsonParser, (req, res, next) => {
        const { username, password } = req.body
        const loginUser = {
            username: username,
            password: password
        }

        const db = req.app.get('db')
        for (let key in loginUser) {
            if (!loginUser[key]) {
                return res.status(400).json({error: `Missing '${key}' in request body`})
            }
        }

        loginUser.username = loginUser.username.toLowerCase()

        UsersService.getUserWithUserName(
            db,
            loginUser.username
        )
        .then(dbUser => {
            if (!dbUser ) {
                return res.status(400).json({
                    error: 'Incorrect username or password',
                  })
            }

            return UsersService.comparePasswords (loginUser.password, dbUser.password)
                .then(compareMatch => {
                    if (!compareMatch) {
                        return res.status(400).json({
                            error: 'Incorrect username or password',
                          })
                    }
                    const sub = dbUser.username
                    const payload = { user_id: dbUser.id }

                    res.send({
                        authToken: UsersService.createJwt(sub, payload)
                    })
                })
        })
        .catch(next)

        })


UsersRouter
    .route('/register/:userid')
    .patch(jsonParser, (req, res, next) => {
        let db = req.app.get('db')
        let { first_name, last_name, email, country, state, cityinput } = req.body
        let { userid } = req.params

        let updatedUser = {
            first_name,
            email,
            country,
            state, 
            city: cityinput
        }

        for (let item in updatedUser) {
            if (!updatedUser[item]) {
                return res.status(400).json(`Please provide the field ${item}`)
            }
        }

        updatedUser.last_name = last_name

        return UsersService.updateUser(db, userid, updatedUser)
            .then(user => {
                    const sub = user.username
                    const payload = { user_id: user.id }

                    res.send({
                        authToken: UsersService.createJwt(sub, payload)
                    })
            })
            .catch(next)
    })

UsersRouter
    .route('/profile')
    .all(requireAuth)
    .get((req, res, next) => {

        let { username } = req.user
        let db = req.app.get('db')

        return UsersService.getUserWithUserName (db, username)
            .then(user => {
                if (!user) {
                    return res.status(400).send(`Please provide a valid username`)
                }

                return res.json(user)
            })
    })
    .patch(multerUploads, (req, res, next) => {
        let { username } = req.user
        let db = req.app.get('db')

        let { city, country, email, first_name, interests, last_name, occupation, state, make_private, nothing } = req.body

        let updatedUser = {}

        for (let item in req.body) {
            if (req.body[item] !== null && req.body[item] !== '') {
                updatedUser[item] = req.body[item]
            }
        }

        if (updatedUser.hasOwnProperty('nothing')) {
            return UsersService.getUserWithUserName(db, username)
                .then(updatedUser => {
                    return res.json(updatedUser)
                })
                .catch(next)
            
        } else if (req.file) {
            const file = dataUri(req).content;
            return uploader.upload(file).then((result) => {
                const image = result.url;
                updatedUser.image = image

                return UsersService.updateUser (db, req.user.id, updatedUser)
                    .then(user => {
                        if (!user) {
                            return res.status(400).send(`Invalid User`)
                        }
                        return UsersService.getUserWithUserName(db, username)
                            .then(updatedUser => {
                                return res.json(user)
                            })
                            .catch(next)
                    })
                    .catch(next)
                })
        } else if (!req.file) {
            return UsersService.updateUser (db, req.user.id, updatedUser)
            .then(user => {
                if (!user) {
                    return res.status(400).send(`Invalid User`)
                }
                return UsersService.getUserWithUserName(db, username)
                    .then(updatedUser => {
                        return res.json(user)
                    })
                    .catch(next)
            })
            .catch(next)
        }      
    })


UsersRouter
    .route('/register')
    .post(jsonParser, (req, res, next) => {
        const { username, password } = req.body
        const db = req.app.get('db')

        for (const field of ['username', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                  })
            }
        }

        let passwordError = UsersService.validatePassword(password)

        if (passwordError ) {
            return res.status(400).json({ error: passwordError })
        }

       UsersService.checkIfUserExists (username, db)
            .then(user => {
                if (user) {
                    return res.status(400).json({ error: `Username already taken` })
                }
                return UsersService.hashPassword (password)
                    .then(hashedPassword => {
                        let newUser = {
                            username,
                            password: hashedPassword
                        }
                        return UsersService.insertUser (newUser, db)
                            .then(insertedUser => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${insertedUser.id}`))
                                    .json(UsersService.serializeUser(insertedUser))
                            })  
                    })
            })
        
        
        

    })

UsersRouter
    .route('/refresh')
    .post(requireAuth, (req, res,) => {
        const sub = req.user.username
        const payload = { user_id: req.user.id }
        res.send({
            authToken: UsersService.createJwt(sub, payload),
        })
    })



module.exports = UsersRouter
