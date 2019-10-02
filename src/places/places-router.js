const express = require('express')
const PlacesRouter = express.Router()
const jsonParser = express.json()
const requireAuth = require('../middleware/jwt-auth')
const PlacesService = require('./places-service')
const path = require('path')

PlacesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        let db = req.app.get('db')

        return PlacesService.getAllPlaces(db)
            .then(places => {
                return res.json(places.map(place => {
                    return PlacesService.serializeNewPlace(place)
                }))
            })
    })
    .post(jsonParser, (req, res, next) => {
        let db = req.app.get('db')
        let { country, state, city } = req.body
        let newPlace = {
            country,
            state,
            city
        }

        for (let item in newPlace) {
            if (!newPlace[item]) {
                return res.status(400).json(`Please fill in a value for the field ${item}`)
            }
        }

        console.log('new place', newPlace)

       
        return PlacesService.findPlace(db, newPlace)
            .then(findPlace => {
                if (!findPlace.length) {
                    return PlacesService.postNewPlace (db, newPlace)
                    .then(place => {
                        return res
                            .status(201)
                            .location(path.posix.join(req.originalUrl, `/${place.id}`))
                            .json(PlacesService.serializeNewPlace(place))
        
                    })
                }

                return res.status(200).json({
                    id: 99999999,
                    text: 'Page already exists'
                })
            })      
    })


module.exports = PlacesRouter


