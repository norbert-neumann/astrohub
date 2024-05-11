import express from 'express'
import validate from '../validator.js'
import { tripSchema, nameSchema } from '../schema.js'
import createTripController from '../controllers/trips.js'
import { BadRequest } from '../errorHandling.js'

function createTripRouter(repository) {
    const router = express.Router()
    const controller = createTripController(repository)

    const validateDate = (req, res, next) => {
        if (req.body.date) {
            const date = new Date(req.body.date)
            if (date.toString() === 'Invalid Date') {
                return next(new BadRequest('Date is invalid'))
            }
            if (date <= new Date()) {
                return next(new BadRequest(`Date must be greater than ${new Date().toISOString()}`))
            }

            return next()
        }
        
        return next(new BadRequest('Request body must contain a date field'))
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
