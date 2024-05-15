import dateService from './dateService.js'
import { idToStar } from '../star-to-index.js'

const forecastService = {
    
    stargazingForecast: ({start, end, ephimeresHistograms, cloudCoverHistogram, starIds, baseDate}) => {
        let forecast = {
            sunset: dateService.offsetDateByMinutes(baseDate, start),
            sunrise: dateService.offsetDateByMinutes(baseDate, end),
            stars: []
        }

        const relevantCloudCoverHistogram = cloudCoverHistogram.slice(start, end)
        const avgCloudCover = relevantCloudCoverHistogram.reduce((acc, curr) => acc + curr) / relevantCloudCoverHistogram.length

        forecast.cloudCoverPct = avgCloudCover.toFixed(2)

        ephimeresHistograms.forEach((ephimeres, index) => {
            const relevantEphimeresHistogram = ephimeres.slice(start, end)
            const startOfVisibility = startOf(relevantEphimeresHistogram)
            const endOfVisibility = endOf(relevantEphimeresHistogram)

            if (startOfVisibility) {
                let star = {
                    name: idToStar[starIds[index]],
                    rise: dateService.offsetDateByMinutes(baseDate, startOfVisibility + start)
                }

                if (endOfVisibility) star.set = dateService.offsetDateByMinutes(baseDate, endOfVisibility + start)

                forecast.stars.push(star)
            }
        })

        return forecast
    }
}

function startOf(histogram) {
    for (let i = 0; i < histogram.length; i++) {
        if (histogram[i] > 0) {
            return i
        }
    }

    return undefined
}

function endOf(histogram) {
    for (let i = histogram.length - 1; i >= 0; i--) {
        if (histogram[i] > 0) {
            return i
        }
    }
    return undefined
}

export default forecastService