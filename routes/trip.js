import express from 'express'
import validate from '../validator.js'
import { tripSchema, nameSchema } from '../schema.js'
import createTripController from '../controllers/trips.js'

function createTripRouter(repository) {
    const router = express.Router()
    const controller = createTripController(repository)

    const validateDate = (req, res, next) => {
        if (req.body.date) {
            const date = new Date(req.body.date)
            if (date.toString() !== 'Invalid Date' && date > new Date()) {
                return next()
            }
            // throw invalid date format
        }
        // thorw request body must contain date field
        res.sendStatus(500)
    }

    router.get('/upcoming', controller.getUpcomingTrips)
    router.get('/:tripId', controller.getTripById)
    router.post('/', validateDate, validate(tripSchema), controller.createTrip)
    router.patch('/:tripId/name', validate(nameSchema), controller.updateName)
    router.patch('/:tripId/date', validateDate, controller.updateDate)
    router.delete('/:tripId', controller.deleteTrip)

    return router
}

export default createTripRouter
