const app = require('./app')
const knex = require('knex')
// const PORT = require('./config').PORT
const { PORT, DB_URL } = require('./config') 
const moment = require('moment-timezone')

// const PORT = process.env.PORT || 8000
let db = knex({
    client: 'pg',
    connection: DB_URL
    // connection : {
    //     host: 'localhost',
    //     user: 'dunder-mifflin',
    //     database: 'neighborhood-db',
    //     timezone: 'utc'
    // }
})

// moment.tz.setDefault("America/Los_Angeles")

console.log('moment', moment().format('MMMM Do YYYY, h:mm:ss a'))

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})