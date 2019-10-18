//added script in package.json
//once you run npm run test, then it sets expect and supertest to be values on the global object
process.env.TZ = 'UCT'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'
process.env.JWT_EXPIRY = '5m'

require('dotenv').config()

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || "postgresql://dunder-mifflin@localhost/neighborhood-db-test"


const expect = require('chai').expect
const supertest = require('supertest')

global.expect = expect
//somewhat equivalent to window.expect = expect 
global.supertest = supertest

