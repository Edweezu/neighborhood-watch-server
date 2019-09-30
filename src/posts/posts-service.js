const xss = require('xss')

const PostService = {
    addPost (db, newPost) {
        return db
            .from('posts')
            .insert(newPost)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getAllPosts (db) {
        return db
            .select('*')
            .from('posts')
    },

    serializePost (post) {
        return {
            id: post.id,
            subject: xss(post.subject),
            message: xss(post.message),
            post_category: xss(post.post_category),
            date_created: xss(post.date_created),
            place_id: post.place_id,
            user_id: post.user_id
        }
    }
}

module.exports = PostService