const express = require('express')
const path = require('path')
const UsersRouter = express.Router()
const jsonParser = express.json()
const UsersService = require('./users-service')


UsersRouter
    .route('/login')
    .post(jsonParser, (req, res, next) => {
        const { username, password } = req.body
        const loginUser = {
            username: username.toLowerCase(),
            password: password
        }

        const db = req.app.get('db')
        for (let key in loginUser) {
            if (!loginUser[key]) {
                return res.status(400).json(`Missing ${key} in request body`)
            }
        }

        UsersService.getUserWithUserName(
            db,
            loginUser.username
        )
        .then(dbUser => {
            if (!dbUser ) {
                return res.status(400).json(`Incorrect user_name or password`)
            }

            return UsersService.comparePassword (loginUser.password, dbUser.password)
                .then(compareMatch => {
                    if (!compareMatch) {
                        return res.status(400).json(`Incorrect username or password`)
                    }

                    let sub = dbUser.username
                    let payload = { user_id: dbUser.id}
                    res.send({
                        authToken: UsersService.createJwt(sub, payload)
                    })
                })
        })
        .catch(next)

        })
    



UsersRouter
    .route('/register')
    .post(jsonParser, (req, res, next) => {
        const { username, password } = req.body
        const db = req.app.get('db')

        //check if all fields are filled
        for (let field in req.body) {
            if (!req.body[field]) {
                return res.status(400).json(`Please fill in the field ${field}`)
            }
        }

        //check if password meets requirements - forgot this
        let passwordError = UsersService.validatePassword(password)

        if (passwordError ) {
            return res.status(400).json(passwordError)
        }

       

        //check if username is taken already
       UsersService.checkIfUserExists (username, db)
            .then(user => {
                if (user) {
                    return res.status(400).json(`That username already exists. Please provide another. `)
                }
                //if not, hash their password
                return UsersService.hashPassword (password)
                    .then(hashedPassword => {
                        //insert user + hashpassword into the users db
                        let newUser = {
                            username,
                            password: hashedPassword
                        }
                        //return res json to the user
                        return UsersService.insertUser (newUser, db)
                            .then(insertedUser => {
                                res
                                    .status(201)
                                    //messed up this
                                    .location(path.posix.join(req.originalUrl, `/${insertedUser.id}`))
                                    .json(UsersService.serializeUser(newUser))
                            })  
                    })
            })
        
        
        

    })

UsersRouter
    .route('/refresh')



module.exports = UsersRouter
