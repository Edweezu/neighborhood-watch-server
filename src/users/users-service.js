const bcrypt = require('bcryptjs')
const xss = require('xss')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    
    checkIfUserExists (username , db) {
        return db('users')
        .where('username', username)
        .first()
        .then(user => !!user)
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
    }
}

module.exports = UsersService