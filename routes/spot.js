import express from 'express'
import validate from '../validator.js'
import {addSpotSchema} from '../schema.js'

function createSpotRouter(repository) {
    const router = express.Router()

    router.get('/distance', async (req, res) => {
        const origin = req.body.origin
        const distanceInKm = req.body.distance || undefined
        const result = await repository.getSpotsSortedByDistanceIncludeDistance(origin, distanceInKm)
        res.send(result)
    })

    router.get('/rating', async (req, res) => {
        const skip = req.body.skip || undefined
        const limit = req.body.limit || undefined
        
        const direction = req.body.orderBy === 'asc' ? 1 : -1
        const sort = {rating: direction}
        
        const spots = await repository.getAllSpots({sort, skip, limit})
        res.send(spots)
    }),

    router.get('/match-name/:name', async (req, res) => {
        const spots = await repository.getSpotsByPartialName(req.params.name)
        res.send(spots)
    })

    router.get('/:spotId', async (req, res) => {
        const spot = await repository.getSpotById(req.params.spotId)
        res.send(spot)
    })

    router.get('/', async (req, res) => {
        const origin = req.body.origin
        const distanceInKm = req.body.distance || undefined
        console.log(origin, distanceInKm)
        const spots = await repository.getSpotsWithinDistance(origin, distanceInKm)
        res.send(spots)
    })

    router.post('/', validate(addSpotSchema), async (req, res) => {
        console.log(req.body)
        const spot = {
            location: [req.body.lattitude, req.body.longitude],
            name: req.body.name,
            rating: 0,
            lightPollution: req.body.lightPollution || undefined
        }
        //repository.saveSpot(spot)
        res.send({data: 'POST spot'})
    })

    router.patch('/:spotId/rating', async (req, res) => {
        const spotId = req.params.spotId
        const newRating = req.body.newRating
        repository.updateRating(spotId, newRating)
        res.send({data: 'PATCH spot'})
    })

    router.delete('/:spotId', async (req, res) => {
        const result = await repository.deleteSpot(req.params.spotId)
        res.send(result)
    })

    return router
}

export default createSpotRouter