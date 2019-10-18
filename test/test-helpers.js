const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


function makeArticlesFixtures() {
    const testUsers = makeUsersArray()
    const testPlaces = makePlacesArray()
    const testPosts = makePostsArray(testUsers, testPlaces)
    const testComments = makeCommentsArray(testUsers, testPosts)
    const testLikes = makeLikesArray(testUsers, testPosts)
    return {
        testUsers, 
        testPlaces, 
        testPosts,
        testComments,
        testLikes
    }
}


function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      password: 'password',
      first_name: 'User1',
      last_name: 'Test1',
      country: 'United States',
      state: 'California',
      city: 'Santa Monica',
      email: 'test1@gmail.com',
      occupation: 'Engineer',
      interests: 'coding',
      image: null
    },
    {
      id: 2,
      username: 'test-user-2',
      password: 'password',
      first_name: 'User2',
      last_name: 'Test2',
      country: 'Indonesia',
      state: 'Bali',
      city: 'Denpansar',
      email: 'test2@gmail.com',
      occupation: 'Accountant',
      interests: 'crunching numbers',
      image: null
    },
    {
      id: 3,
      username: 'test-user-3',
      password: 'password',
      first_name: 'User3',
      last_name: 'Test3',
      country: 'United States',
      state: 'New York',
      city: 'New York',
      email: 'test3@gmail.com',
      occupation: 'Doctor',
      interests: 'saving lives',
      image: null
    },
    {
      id: 4,
      username: 'test-user-4',
      password: 'password',
      first_name: 'User4',
      last_name: 'Test4',
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      email: 'test4@gmail.com',
      occupation: 'Mechanical Engineer',
      interests: 'Hiking, boxing',
      image: null
    },
    {
      id: 5,
      username: 'test-user-5',
      password: 'password',
      first_name: 'User5',
      last_name: 'Test5',
      country: 'United States',
      state: 'California',
      city: 'San Francisco',
      email: 'test5@gmail.com',
      occupation: 'Entrepeneur',
      interests: 'Playing basketball',
      image: null
    },
  ]
}

function makePlacesArray() {
  return [
    {
      id: 1,
      country: 'Indonesia',
      state: 'Bali',
      city: 'Denpansar'
    },
    {
      id: 2,
      country: 'United States',
      state: 'New York',
      city: 'New York'
    },
    {
      id: 3,
      country: 'United States',
      state: 'California',
      city: 'San Francisco'
    },
    {
      id: 4,
      country: 'United States',
      state: 'California',
      city: 'Santa Monica'
    },   
  ]
}

function makePostsArray(users, places) {
  return [
    {
      id: 1,
      subject: 'Crime Number 1',
      message: 'This is the text for Crime #1',
      date_created:  new Date('2020-01-22T07:00:00.00Z'),
      post_category: 'Crime and Alerts',
      place_id: places[0].id,
      user_id: users[0].id,
      likes: 0
    },
    {
      id: 2,
      subject: 'Event Number 2',
      message: 'This is the text for Event #2',
      date_created:  new Date('2020-02-22T07:00:00.00Z'),
      post_category: 'Upcoming Events',
      place_id: places[1].id,
      user_id: users[1].id,
      likes: 1
    },
    {
      id: 3,
      subject: 'Lost and Found 3',
      message: 'This is the text for Lost and Found #3',
      date_created:  new Date('2020-03-22T07:00:00.00Z'),
      post_category: 'Lost and Found',
      place_id: places[2].id,
      user_id: users[2].id,
      likes: 2
    },
    {
      id: 4,
      subject: 'Crime Number 4',
      message: 'This is the text for Crime #4',
      date_created:  new Date('2020-04-22T07:00:00.00Z'),
      post_category: 'Crime and Alerts',
      place_id: places[3].id,
      user_id: users[3].id,
      likes: 0
    },
  ];
}

function makeCommentsArray(users, posts) {
  return [
    {
      id: 1,
      text: 'Random Comment 1',
      date_created: new Date('2020-01-25T07:00:00.00Z'),
      user_id: users[0].id,
      post_id: posts[0].id
    },
    {
      id: 2,
      text: 'Random Comment 2',
      date_created: new Date('2020-02-25T07:00:00.00Z'),
      user_id: users[1].id,
      post_id: posts[1].id
    },
    {
      id: 3,
      text: 'Random Comment 3',
      date_created: new Date('2020-03-25T07:00:00.00Z'),
      user_id: users[2].id,
      post_id: posts[2].id
    },
    {
      id: 4,
      text: 'Random Comment 4',
      date_created: new Date('2020-04-25T07:00:00.00Z'),
      user_id: users[3].id,
      post_id: posts[3].id
    },
  ];
}

function makeLikesArray(users, posts) {
  return [
    {
      id: 1,
      post_id: posts[0].id,
      user_id: users[0].id
    },
    {
      id: 2,
      post_id: posts[1].id,
      user_id: users[1].id
    },
    {
      id: 3,
      post_id: posts[2].id,
      user_id: users[2].id
    },
    {
      id: 4,
      post_id: posts[3].id,
      user_id: users[3].id
    },
  ];
}


function makeExpectedPost(post, users=[], places=[]) {

    const expectedUser = users.find(user => user.id === post.user_id)
    const expectedPlace = places.find(place => place.id === post.place_id)

    return {
        id: post.id,
        subject: post.subject,
        message: post.message,
        date_created:  post.date_created,
        post_category:  post.post_category,
        user_id: expectedUser.id,
        place_id: expectedPlace.id,
        likes: post.likes
    }
}
function makeExpectedComment(comment, users=[], posts=[]) {

    const expectedUser = users.find(user => user.id === comment.user_id)
    const expectedPost = posts.find(post => post.id === comment.post_id)

    return {
        id: comment.id,
        text: comment.text,
        date_created: comment.date_created,
        user_id: expectedUser.id,
        post_id: expectedPost.id
    }
}

function makeExpectedPlace(place) {

    return {
        id: place.id,
        country: place.country,
        state: place.state,
        city: place.city,
    }
}

function makeExpectedLikes(like, posts=[], users=[]) {

    const expectedUser = users.find(user => user.id === like.user_id)
    const expectedPost = posts.find(post => post.id === like.post_id)

    return {
        id: like.id,
        user_id: expectedUser.id,
        post_id: expectedPost.id,
    }
}

function makeMaliciousPost(user, place) {
  const maliciousPost = {
    id: 911,
    subject: 'Naughty naughty very naughty <script>alert("xss");</script>',
    post_category: 'Crime and Alerts',
    date_created: new Date(),
    message: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
    place_id: user.id,
    likes: 0
  }
  const expectedPost = {
    ...makeexpectedPost([user], [place], maliciousPost),
    subject: 'Naughty naughty very naughty <script>alert("xss");</script>',
    message: 'Naughty naughty very naughty <script>alert("xss");</script>',
  }
  return {
    maliciousPost,
    expectedPost,
  }
}

function makeMaliciousComment(user, post) {
    const maliciousComment = {
        id: 1,
        text: 'Naughty naughty very naughty <script>alert("xss");</script>',
        date_created: new Date('2029-01-22T07:00:00.00Z'),
        user_id: user.id,
        post_id: post.id,
    }
    const expectedComment = {
        ...makeExpectedComment([user], [post], maliciousComment),
        text: 'Naughty naughty very naughty <script>alert("xss");</script>',
    }
    return {
        maliciousComment,
        expectedComment
    }
}



function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        places,
        posts,
        comments,
        likes,
        users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE places_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE posts_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE likes_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('places_id_seq', 0)`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
        trx.raw(`SELECT setval('posts_id_seq', 0)`),
        trx.raw(`SELECT setval('comments_id_seq', 0)`),
        trx.raw(`SELECT setval('likes_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}


function seedMaliciousPost(db, user, post) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('posts')
        .insert([post])
    )
}

function seedMaliciousComment(db, user, comment) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('comments')
        .insert([comment])
    )
}



function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makePlacesArray,
  makePostsArray,
  makeCommentsArray,
  makeLikesArray,
  makeArticlesFixtures,
  makeExpectedLikes,
  makeExpectedPost,
  makeExpectedComment,
  makeExpectedPlace,
  makeAuthHeader,
  cleanTables,
  seedUsers,
  makeMaliciousComment,
  makeMaliciousPost,
  seedMaliciousPost,
  seedMaliciousComment
}
