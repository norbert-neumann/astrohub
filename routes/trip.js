import express from 'express'

function createTripRouter(repository) {
    const router = express.Router()

    router.get('/', async (req, res) => {
        res.send({data: 'GET trip'})
    })
    
    router.post('/', async (req, res) => {
        res.send({data: 'POST trip'})
    })
    
    router.put('/location', async (req, res) => {
        let currentSpotId = req.query.currentSpotId
        let newSpotId = req.query.newSpotId
        let result = await repository.updateTripLocation(currentSpotId, newSpotId)
        res.send(result)
    })
    
    router.delete('/', async (req, res) => {
        res.send({data: 'DELETE trip'})
    })

    return router
}

export default createTripRouter