import dateService from '../services/dateService.js'
import weatherService from '../services/weatherService.js'
import ephimeresService from '../services/ephimeresService.js'
import forecastService from '../services/forecastService.js'
import { starToId } from '../star-to-index.js'

export default function getForecastController() {

    const getForecast = async (req, res) => {
        const lattitude = req.body.lattitude
        const longitude = req.body.longitude
        const starIds = req.body.stars.map(star => starToId[star])
        const timeZone = req.body.timeZone || 'UTC'
        const threshold = req.body.threshold || 30.0
    
        // TODO: package these to Promise array
        const ephimeres = await ephimeresService.getStarEphimeres(lattitude, longitude, starIds)
        const { cloudCover, nights } = await weatherService.getWeatherData(lattitude, longitude)
    
        const nightForecasts = nights.map(night => forecastService.stargazingForecast({
                start: night[0],
                end: night[1],
                ephimeresHistograms: ephimeres,
                cloudCoverHistogram: cloudCover,
                starIds: starIds
            })
        )
    
        let forecast = await Promise.all(nightForecasts)
        
        if (timeZone !== 'UTC') {
            forecast = dateService.convertDatesToTimeZone(forecast, timeZone)
        }
    
        res.send(forecast.filter(night => night.cloudCoverPct < threshold))
    }

    return {
        getForecast
    }
}