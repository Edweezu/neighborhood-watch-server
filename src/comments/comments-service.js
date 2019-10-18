const xss = require('xss')

const CommentsService = {
    getAllComments (db) {
        return db
            .select(
                'comments.*',
                db.raw(
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
                )
            )
            .from('comments')
            .leftJoin(
                'users',
                'comments.user_id',
                'users.id'
            )
            .groupBy('comments.id', 'users.id')
    },

    getById(db, id) {
        return db
          .from('comments')
          .select(
            'comments.*',
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
            )
          )
          .leftJoin(
            'users',
            'comments.user_id',
            'users.id',
          )
          .where('comments.id', id)
          .first()
      },

    serializeComment (comment) {
        return {
            id: comment.id,
            text: xss(comment.text),
            date_created: xss(comment.date_created),
            // date_created: comment.date_created,
            user_id: comment.user_id,
            post_id: comment.post_id,
            user: {
                id: comment.user.id,
                username: xss(comment.user.username),
                first_name: xss(comment.user.first_name),
                last_name: xss(comment.user.last_name),
                country: xss(comment.user.country),
                state: xss(comment.user.state),
                city: xss(comment.user.city),
                email: xss(comment.user.email)
            },
            user_logged_in: comment.user_logged_in
        }
    },

    deleteComment(db, id) {
        return db
            .from('comments')
            .where('id', id)
            .del()
    },

    updateComment (db, newComment, commentId) {
        return db
            .from('comments')
            .where('id', commentId)
            .update(newComment)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    postNewComment (db, newComment) {
        console.log('intial comment', newComment)
        return db
            .from('comments')
            .insert(newComment)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
            .then(comment => {
                console.log('service comment', comment)
                //tricky
                return CommentsService.getById(db, comment.id)
            })
    }
}   

module.exports = CommentsService