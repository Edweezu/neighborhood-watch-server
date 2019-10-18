const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
  let db

  const {
    testUsers,
    testPlaces, 
    testPosts,
    testComments,
    testLikes
  } = helpers.makeArticlesFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  beforeEach('insert users', () => {
    return db
        .from('users')
        .insert(testUsers)
  })
  beforeEach('insert places', () => {
    return db
        .from('places')
        .insert(testPlaces)
  })
  beforeEach('insert posts', () => {
    return db
        .from('posts')
        .insert(testPosts)
  })

  beforeEach('insert comments', () => {
    return db
        .from('comments')
        .insert(testComments)
  })
  beforeEach('insert likes', () => {
    return db
        .from('likes')
        .insert(testLikes)
  })



  const protectedEndpoints = [
    {
      name: 'GET /api/places',
      path: '/api/places',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/places',
      path: '/api/places',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/posts',
      path: '/api/posts',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/posts',
      path: '/api/posts',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/posts/:postid',
      path: '/api/posts/1',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/posts/:postid',
      path: '/api/posts/1',
      method: supertest(app).patch,
    },
    {
      name: 'DELETE /api/posts/:postid',
      path: '/api/posts/1',
      method: supertest(app).delete,
    },
    {
      name: 'GET /api/posts/:postid/likes',
      path: '/api/posts/1/likes',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/posts/:postid/likes',
      path: '/api/posts/1/likes',
      method: supertest(app).post,
    },
    {
      name: 'DELETE /api/posts/:postid/likes',
      path: '/api/posts/1/likes',
      method: supertest(app).delete,
    },
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { username: 'user-not-existy', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})
