import express from 'express'
import validate from '../validator.js'
import { tripSchema, nameSchema, dateSchema } from '../schema.js'
import createTripController from '../controllers/trips.js'

function createTripRouter(repository) {
    const router = express.Router()
    const controller = createTripController(repository)

    router.get('/upcoming', controller.getUpcomingTrips)
    router.get('/:tripId', controller.getTripById)
    router.post('/', validate(tripSchema), controller.createTrip)
    router.patch('/:tripId/name', validate(nameSchema), controller.updateName)
    router.patch('/:tripId/date', validate(dateSchema), controller.updateDate)
    router.delete('/:tripId', controller.deleteTrip)

    return router
}

export default createTripRouter
