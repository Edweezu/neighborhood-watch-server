const xss = require('xss')

const PostService = {
    addPost (db, newPost) {
        console.log('initial post', newPost)
        return db
            .from('posts')
            .insert(newPost)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            .then(post => {
                console.log('service post', post)
                return PostService.getById(db, post.id)
            })
    },

    getAllPosts (db) {
        return db
            .select(
                'posts.*',
                //remember to put this in the select clause because you're building a new key called user with an object that has user.id, etc. 
                db.raw(
                    //this omits all null values in the object
                    `json_strip_nulls(
                        json_build_object(
                            'id', users.id,
                            'username', users.username,
                            'first_name', users.first_name,
                            'last_name', users.last_name,
                            'country', users.country,
                            'state', users.state,
                            'city', users.city,
                            'email', users.email
                        )
                    ) AS user`
                ),
                db.raw(
                    `count(DISTINCT comments) AS number_of_comments`
                )           
            )
            .from('posts')
            .leftJoin(
                'users',
                'posts.user_id',
                'users.id'
            )
            .leftJoin(
                'comments',
                'posts.id',
                'comments.post_id'
            )
            .groupBy('posts.id', 'users.id')
    },

    getAllLikes (db, postid) {
        return db
            .from('likes')
            .where('post_id', postid)

    },

    checkUserLikes (db, postid, userid) {
        return db
            .from('likes')
            .where({
                post_id: postid,
                user_id: userid
            })
    },

    postUserLike (db, newLike) {
        return db
            .from('likes')
            .insert(newLike)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    deleteUserLike (db, postid, userid) {
        return db
            .from('likes')
            .where({
                post_id: postid,
                user_id: userid
            })
            .del()
    },

    //returning is only for update and add methods
    getPostById (db, postid) {
        return db
            .select('*')
            .from('posts')
            .where('id', postid)
            .first()
    },

    deletePost (db, postid) {
        return db
            .from('posts')
            .where('id', postid)
            .del()
    },

    getById(db, id) {
        return db
          .from('posts')
          .select(
            'posts.*',
            db.raw(
              `json_strip_nulls(
                    json_build_object (
                        'id', users.id,
                        'username', users.username,
                        'first_name', users.first_name,
                        'last_name', users.last_name,
                        'country', users.country,
                        'state', users.state,
                        'city', users.city,
                        'email', users.email
                    )
                ) AS "user"`
            ),
            db.raw(
                `count(DISTINCT comments) AS number_of_comments`
            )           
          )
          .leftJoin(
            'users',
            'posts.user_id',
            'users.id',
          )
          .leftJoin(
            'comments',
            'posts.id',
            'comments.post_id'
          )
          .where('posts.id', id)
          .groupBy('posts.id', 'users.id')
          .first()
      },

      updatePost (db, updatedPost, postid) {
          return db
            .from('posts')
            .select('*')
            .where('id', postid)
            .update(updatedPost)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
      },

    serializePost (post) {
        return {
            id: post.id,
            subject: xss(post.subject),
            message: xss(post.message),
            post_category: xss(post.post_category),
            date_created: xss(post.date_created),
            place_id: post.place_id,
            user_id: post.user_id,
            image: post.image,
            user: {
                id: post.user.id,
                username: xss(post.user.username),
                first_name: xss(post.user.first_name),
                last_name: xss(post.user.last_name),
                country: xss(post.user.country),
                state: xss(post.user.state),
                city: xss(post.user.city),
                email: xss(post.user.email)
            },
            number_of_comments: post.number_of_comments,
            user_logged_in: post.logged_user,
            likes: post.likes
        }
    }
}

module.exports = PostService
