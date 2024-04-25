import express from 'express'

function createForecastRouter(repository) {
    const router = express.Router()

    router.get('/', async (req, res) => {
        res.send({data: 'GET forecast'})
    })

    return router
}

export default createForecastRouter