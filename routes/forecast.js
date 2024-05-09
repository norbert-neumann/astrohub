import express from 'express'
import validate from '../validator.js'
import { forecastSchema } from '../schema.js'
import { getEphimeres, getWeather, rateInterval } from '../test.js'
import STARS from '../star-to-index.js'

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
        console.log(stars)

        const ephimeres = await getEphimeres(lattitude, longitude, stars)
        const { histogram, nights } = await getWeather(lattitude, longitude)

        console.log(ephimeres)
        console.log(histogram)
        console.log(nights)

        res.send({data: 'GET forecast'})
    })

    return router
}

export default createForecastRouter