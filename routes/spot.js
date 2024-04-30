import express from 'express'

function createSpotRouter(repository) {
    const router = express.Router()

    router.get('/distance', async (req, res) => {
        const location = [19.1, 47.3]
        const result = await repository.getSpotsSortedByDistanceIncludeDistance(location, 32000)
        res.send(result)
    })

    router.get('/rating', async (req, res) => {
        const skip = req.body.skip ? parseInt(req.body.skip) : undefined
        const limit = req.body.limit ? parseInt(req.body.limit) : undefined
        
        const direction = req.body.direction === 'ascending' ? 1 : -1
        const sort = {rating: direction}
        console.log(skip, limit, sort)
        const spots = await repository.getAllSpots(sort, skip, limit)
        console.log(spots)
        res.send(spots)
    }),

    router.get('/:name', async (req, res) => {
        const spots = await repository.getSpotsByPartialName(req.params.name)
        res.send(spots)
    })

    router.get('/:spotId', async (req, res) => {
        const spot = await repository.getSpotById(req.params.spotId)
        res.send(spot)
    })

    router.get('/', async (req, res) => {
        res.send({data: 'GET spot'})
    })

    router.post('/', async (req, res) => {
        const spot = {
            lattitude: req.body.lattitude,
            longitude: req.body.longitude,
            name: req.body.name,
            rating: 0,
            lightPollution: undefined
        }
        repository.saveSpot(spot)
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