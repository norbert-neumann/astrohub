import express from 'express'
import validate from '../validator.js'
import { forecastSchema } from '../schema.js'
import { getStarEphimeres, getWeatherData, stargazingForecast } from '../test.js'
import { STARS } from '../star-to-index.js'

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
        const stars = req.body.stars.map(star => STARS[star])

        const ephimeres = await getStarEphimeres(lattitude, longitude, stars)
        const { cloudCover, nights } = await getWeatherData(lattitude, longitude)

        nights.map(async (night) => {
            console.log(await stargazingForecast({
                start: night[0],
                end: night[1],
                ephimeresHistograms: ephimeres,
                cloudCoverHistogram: cloudCover,
                starIds: stars
            }))
        })

        res.send({data: 'GET forecast'})
    })

    return router
}

export default createForecastRouter