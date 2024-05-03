import express from 'express'
import validate from '../validator.js'
import { addTripSchema } from '../schema.js'

function createTripRouter(repository) {
    const router = express.Router()

    // maxDate, maxDistance
    router.get('/upcoming', async (req, res) => {
        const origin = req.body.origin
        const maxDistance = req.body.distance || undefined
        const result = await repository.getUpcomingTrips(origin, maxDistance)
        res.send(result)
    })

    router.get('/:tripId', async (req, res) => {
        const trip = repository.getTripById(req.params.tripId)
        res.send(trip)
    })
    
    router.post('/', async (req, res) => {
        const newTrip = {
            spotId: req.body.spotId,
            date: req.body.date,
            name: req.body.name
        }
        const result = await repository.saveTrip(newTrip)
        res.send(result)
    })
    
    router.patch('/:tripId/name', async (req, res) => {
        const tripId = req.params.tripId
        const newName = req.body.newName
        let result = await repository.updateName(tripId, newName)
        res.send(result)
    })

    router.patch('/:tripId/date', async (req, res) => {
        const tripId = req.params.tripId
        const newDate = req.body.newDate
        let result = await repository.updateDate(tripId, newDate)
        res.send(result)
    })
    
    router.delete('/:tripId', async (req, res) => {
        repository.deleteTrip(req.params.tripId)
        res.send({data: 'DELETE trip'})
    })

    return router
}

export default createTripRouter