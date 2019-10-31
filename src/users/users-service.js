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

    getAllUsers (db) {
        return db
            .select('*')
            .from('users')
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

    createJwt(sub, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
          subject: sub,
          expiresIn: config.JWT_EXPIRY,
          algorithm: 'HS256',
        })
    },
    
    verifyJwt(token) {
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

    serializeGetAllUser (user) {
        return {
            id: user.id,
            username: xss(user.username),
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            country: xss(user.country),
            state: xss(user.state),
            city: xss(user.city),
            email: xss(user.email),
            occupation: xss(user.occupation),
            interests: xss(user.interests),
            image: xss(user.image),
            make_private: user.make_private,
            nothing: xss(user.nothing)
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