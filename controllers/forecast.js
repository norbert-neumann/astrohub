import dateService from '../services/dateService.js'
import weatherService from '../services/weatherService.js'
import ephimeresService from '../services/ephimeresService.js'
import forecastService from '../services/forecastService.js'
import { starToId } from '../star-to-index.js'

export default function getForecastController() {

    const getForecast = async (req, res, next) => {
        try {
            const lattitude = req.body.lattitude
            const longitude = req.body.longitude
            const starIds = req.body.stars.map(star => starToId[star])
            const timeZone = req.body.timeZone || 'UTC'
            const threshold = req.body.threshold || 30.0
        
            const ephimeresIntervals = await ephimeresService.getStarEphimeres(lattitude, longitude, starIds)
            const ephimeres = ephimeresIntervals.map(intervals => convertIntervalsToHistogram(intervals))
           
            const { weatherIntervals, nightIntervals, baseDate } = await weatherService.getWeatherData(lattitude, longitude)
            const cloudCoverHistogram = convertIntervalsToHistogram(weatherIntervals)

            const nightForecasts = nightIntervals.map(night => forecastService.stargazingForecast({
                    start: night[0],
                    end: night[1],
                    ephimeresHistograms: ephimeres,
                    cloudCoverHistogram: cloudCoverHistogram,
                    starIds: starIds,
                    baseDate
                })
            )
        
            let forecast = await Promise.all(nightForecasts)
            forecast = dateService.convertForecastToTimeZone(forecast, timeZone)
        
            res.send(forecast.filter(night => night.cloudCoverPct < threshold))
        } catch (error) {
            next(error)
        }
    }

    return {
        getForecast
    }
}


function convertIntervalsToHistogram(intervals) {
    let histrogram = Array(27360).fill(0)

    for (const interval of intervals) {
        for (let i = interval[0]; i <= interval[1]; i++) {
            histrogram[i] = interval[2]
        }
    }

    return histrogram
}