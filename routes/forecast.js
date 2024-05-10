import express from 'express'
import validate from '../validator.js'
import { forecastSchema } from '../schema.js'
import createForecastController from '../controllers/forecast.js'

function createForecastRouter(repository) {
    const router = express.Router()
    const controller = createForecastController()

    const preprocessStars = (req, res, next) => {
        if (req.body.stars && Array.isArray(req.body.stars)) {
            req.body.stars = req.body.stars.map(star => star.toUpperCase())
        }
        next()
    }

    router.get('/', preprocessStars, validate(forecastSchema), controller.getForecast)

    return router
}

export default createForecastRouter