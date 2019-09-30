const xss = require('xss')

const CommentsService = {
    getAllComments (db) {
        return db
            .select('*')
            .from('comments')
    },

    serializeComment (comment) {
        return {
            id: comment.id,
            text: xss(comment.text),
            date_created: comment.date_created,
            user_id: comment.user_id,
            post_id: comment.post_id
        }
    }
}   

module.exports = CommentsService