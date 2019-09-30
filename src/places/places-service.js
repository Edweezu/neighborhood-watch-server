const xss = require('xss')

const PlacesService = {
    postNewPlace (db, newPlace ) {
        return db
            .from('places')
            .insert(newPlace)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    serializeNewPlace (place) {
        return {
            id: place.id,
            country: xss(place.country),
            state: xss(place.state),
            city: xss(place.city),
        }
    },

    getAllPlaces (db) {
        return db
            .select('*')
            .from('places')
    }
}

module.exports = PlacesService