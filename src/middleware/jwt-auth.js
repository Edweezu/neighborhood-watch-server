const UsersService = require('../users/users-service')

function requireAuth (req, res, next) {
    const authToken = req.get('Authorization') || ''

    let bearerToken;
    if (!authToken.toLowerCase().startsWith('bearer ')) {
        
        return res.status(401).json({
            error: 'Missing bearer token'
        })
    } else {
        bearerToken = authToken.slice(7, authToken.length)
    }

    try {
        let payload = UsersService.verifyJwt(bearerToken)
        UsersService.getUserWithUserName(
            req.app.get('db'),
            payload.sub
        )
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    error: 'Unauthorized request'
                })    
            }
            //attaching the returned user onto the req object which can be used in the next route path 
            req.user = user
            next()
        })
        .catch(err => {
            console.error(err)
            next(err)
        })
    } catch(error) {
        return res.status(401).json({
            error: 'Unauthorized request'
        })
    }
}

module.exports = requireAuth

