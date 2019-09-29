const bcrypt = require('bcryptjs')
const xss = require('xss')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const jwt = require('jsonwebtoken')
const config = require('../config')

const UsersService = {

    getUserWithUserName(db, username) {
        return db('users')
          .where({ username })
          .first()
    },

    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },    
    
    checkIfUserExists (username , db) {
        return db('users')
        .where('username', username)
        .first()
        .then(user => !!user)
    },

    createJwt(payload) {
        //returns json web token as string
        //payload = data thats stored inside the JWT
        return jwt.sign(payload, config.JWT_SECRET, {
          expiresIn: config.JWT_EXPIRY,
          algorithm: 'HS256',
          //how the signature should be computed
        })
    },
    
    verifyJwt(token) {
         //returns payload decoded if correct token, if not throws error
         return jwt.verify(token, config.JWT_SECRET, {
             algorithms: ['HS256']
         })
    },

    validatePassword (password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters'
          }
          if (password.length > 72) {
            return 'Password must be less than 72 characters'
          }
          if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
          }
          if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain one upper case, lower case, number and special character'
          }
          return null
    },

    hashPassword (password) {
        return bcrypt.hash(password, 12)
    },

    insertUser (user, db) {
        return db
            .from('users')
            .insert(user)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    serializeUser (user) {
        return {
            id: user.id,
            username: xss(user.username)
        }
    },

    updateUser (db, userId, info) {
        return db
            .from('users')
            .where('id', userId)
            .update(info)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    }
}

module.exports = UsersService