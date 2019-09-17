const app = require('./app')
const knex = require('knex')
// const PORT = require('./config').PORT
const { PORT, DB_URL } = require('./config') 

// const PORT = process.env.PORT || 8000
let db = knex({
    client: 'pg',
    connection: DB_URL
})

app.set('db', db)

app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`)
})