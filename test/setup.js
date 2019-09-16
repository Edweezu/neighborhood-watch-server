//added script in package.json
//once you run npm run test, then it sets expect and supertest to be values on the global object

const expect = require('chai').expect
const supertest = require('supertest')

global.expect = expect
//somewhat equivalent to window.expect = expect 
global.supertest = supertest

