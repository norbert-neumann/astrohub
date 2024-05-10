import express from 'express'
import validate from '../validator.js'
import { spotSchema, nameSchema, ratingSchema } from '../schema.js'
import createSpotController from '../controllers/spot.js'

function createSpotRouter(repository) {
    const router = express.Router()
    const controller = createSpotController(repository)

    router.get('/distance', controller.getSpotsSortedByDistance)
    router.get('/rating', controller.getAllSpotsSortedByRating)
    router.get('/match-name/:name', controller.getSpotsByPartialName)
    router.get('/:spotId', controller.getSpotById)
    router.get('/', controller.getSpotsWithinDistance)

    router.post('/', validate(spotSchema), controller.createSpot)

    router.patch('/:spotId/name', validate(nameSchema), controller.updateName)
    router.patch('/:spotId/rating', validate(ratingSchema), controller.updateRating)

    router.delete('/:spotId', controller.deleteSpot)

    return router
}

export default createSpotRouter
