import express from 'express'
import validate from '../validator.js'
import { forecastSchema } from '../schema.js'
import { getStarEphimeres, getWeatherData, stargazingForecast } from '../test.js'
import { starToId } from '../star-to-index.js'

function createForecastRouter(repository) {
    const router = express.Router()

    const preprocessStars = (req, res, next) => {
        if (req.body.stars && Array.isArray(req.body.stars)) {
            req.body.stars = req.body.stars.map(star => star.toUpperCase())
        }
        next()
    }

    router.get('/', preprocessStars, validate(forecastSchema), async (req, res) => {
        const lattitude = req.body.lattitude
        const longitude = req.body.longitude
        const starIds = req.body.stars.map(star => starToId[star])

        const ephimeres = await getStarEphimeres(lattitude, longitude, starIds)
        const { cloudCover, nights } = await getWeatherData(lattitude, longitude)

        const nightForecasts = nights.map(night => stargazingForecast({
                start: night[0],
                end: night[1],
                ephimeresHistograms: ephimeres,
                cloudCoverHistogram: cloudCover,
                starIds: starIds
            })
        )

        const forecast = await Promise.all(nightForecasts)

        res.send(forecast.filter(night => night.cloudCoverPct < 30.0))
    })

    return router
}

export default createForecastRouter