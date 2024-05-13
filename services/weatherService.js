import dateService from "./dateService.js"

const visualCrossingApiKey = 'X6XEVSJRDWZV4D9V2VWARKL24'
let visualCrossingEndpoint = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/forecast'
const visualCrossingParams = {
    locations: "46.660747,19.590709",
    aggregateHours: 1,
    unitGroup: "us",
    shortColumnNames: false,
    contentType: "json",
    includeAstronomy: true,
    key: visualCrossingApiKey
}

const weatherService = {

    getWeatherData: (lattitude, longitude) => {
        return new Promise(async (resolve, reject) => {
        
            const location = [lattitude, longitude].join(',')

            let params =  new URLSearchParams(visualCrossingParams)
            params.set('locations', location)
            const url = visualCrossingEndpoint + '?' + params.toString()

            let weatherResponse = await fetch(url)
            let weatherData = await weatherResponse.json()
            let hourlyForecast = weatherData.locations[location].values
            const baseDate = new Date(hourlyForecast[0].datetimeStr).setUTCHours(0, 0, 0, 0)

            let clearSykIntervals = getClearSkyIntervals(baseDate, hourlyForecast)
            let nightIntervals = getNightIntervals(baseDate, hourlyForecast)

            resolve({weatherIntervals: clearSykIntervals, nightIntervals: nightIntervals, baseDate})
        })
    }   
}

function getClearSkyIntervals(baseDate, hourlyForecast) {
    let intervals = []

    hourlyForecast.forEach(forecast => {
        const startDate = new Date(forecast.datetimeStr)
        const endDate = new Date(startDate)
        endDate.setHours(startDate.getHours() + 1);

        const startDateInMinutes = dateService.minutesBetweenDates(baseDate, startDate)
        const endDateInMinutes = dateService.minutesBetweenDates(baseDate, endDate)

        intervals.push([startDateInMinutes, endDateInMinutes, forecast.cloudcover])
    })

    return intervals
}

function getNightIntervals(baseDate, values) {
    let riseSetTimes = []

    for (let i = 0; i < values.length; i+=24) {
        riseSetTimes.push(new Date(values[i].sunrise))
        riseSetTimes.push(new Date(values[i].sunset))
    }

    let nightInvervals = []
    for (let i = 1; i < riseSetTimes.length - 1; i+=2) {
        nightInvervals.push([
                dateService.minutesBetweenDates(baseDate, riseSetTimes[i]),
                dateService.minutesBetweenDates(baseDate, riseSetTimes[i + 1])
            ])   
    }

    return nightInvervals
}

export default weatherService