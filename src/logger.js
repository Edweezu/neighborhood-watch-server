require('dotenv').config()
const winston = require('winston')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        //writes all logs to the combined.log file
        new winston.transports.File({
            filename: 'combined.log'
        })
    ]
})

//formats the string that logs in combined.log file
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }))
}

module.exports = logger