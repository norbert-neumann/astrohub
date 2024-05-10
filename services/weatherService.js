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
            const currentDate = new Date()
            const baseDate = currentDate.setUTCHours(0, 0, 0, 0)

            let params =  new URLSearchParams(visualCrossingParams)
            params.set('locations', location)
            const url = visualCrossingEndpoint + '?' + params.toString()

            let weatherResponse = await fetch(url)
            let weatherData = await weatherResponse.json()
            let hourlyForecast = weatherData.locations[location].values

            let weatherHistogram = getWeatherHistogram(baseDate, hourlyForecast)
            let nightIntervals = getNightIntervals(baseDate, hourlyForecast)

            resolve({cloudCover: weatherHistogram, nights: nightIntervals})
        })
    }   
}

function getWeatherHistogram(baseDate, hourlyForecast) {
    let histrogram = Array(27360).fill(0)

    hourlyForecast.forEach(forecast => {
        const startDate = new Date(forecast.datetimeStr)
        const endDate = new Date(startDate)
        endDate.setHours(startDate.getHours() + 1);

        const startDateInMinutes = dateService.minutesBetweenDates(baseDate, startDate)
        const endDateInMinutes = dateService.minutesBetweenDates(baseDate, endDate)

        for (let i = startDateInMinutes; i <= endDateInMinutes; i++) {
            histrogram[i] = forecast.cloudcover
        }
    })

    return histrogram
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