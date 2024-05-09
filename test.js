import { JSDOM } from 'jsdom'
import { indexToStar } from './star-to-index.js'

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

let usnoEndpoint = 'https://aa.usno.navy.mil/calculated/mrst?'
const usnoParams = {
    body: undefined,
    date: undefined,
    reps: 16,
    lat: undefined,
    lon: undefined,
    label: null,
    tz: 0.00,
    tz_sign: -1,
    height: 0.00,
    submit: 'Get+Data'
}

function convertToMinutes(day, timeString) {
    const [hours, minutes] = timeString.split(':')
    return day * 1440 + Number(hours) * 60 + Number(minutes)
}


export function convertEphimeresToIntervals(rawText) {
    const lines = rawText.split('\n')
    const riseSetTable = lines.slice(16, lines.length - 3)

    let intervals = []
    let rise, set

    for (let day = 0; day < riseSetTable.length; day++) {
        const row = riseSetTable[day];
        rise = row.substring(25, 30)
        set = row.substring(59, 64)

        if (rise.trim()) {
            let riseInMinutes = convertToMinutes(day, rise)
            let setInMinutes = convertToMinutes(day, set)

            if (riseInMinutes > setInMinutes) {
                setInMinutes = convertToMinutes(day + 1, set)
            }
            intervals.push([riseInMinutes, setInMinutes])
        }
    }

    return intervals
}

export function addIntervalToHistogram(histrogram, interval) {
    let newHistrogram = [...histrogram]
    
    for (let i = interval[0]; i <= interval[1]; i++) {
        newHistrogram[i]++
    }

    return newHistrogram
}

export function getNightIntervals(baseDate, values) {
    let riseSetTimes = []

    for (let i = 0; i < values.length; i+=24) {
        riseSetTimes.push(new Date(values[i].sunrise))
        riseSetTimes.push(new Date(values[i].sunset))
    }

    let nightInvervals = []
    for (let i = 1; i < riseSetTimes.length - 1; i+=2) {
        nightInvervals.push([minutesBetweenDates(baseDate, riseSetTimes[i]), minutesBetweenDates(baseDate, riseSetTimes[i + 1])])   
    }

    return nightInvervals
}

export function getEphimeresHistogram(intervals) {
    let histrogram = Array(27360).fill(0)

    for (const interval of intervals) {
        for (let i = interval[0]; i <= interval[1]; i++) {
            histrogram[i] = 1
        }
    }

    return histrogram
}

export function getWeatherHistogram(baseDate, hourlyForecast) {
    let histrogram = Array(27360).fill(0)

    hourlyForecast.forEach(forecast => {
        const startDate = new Date(forecast.datetimeStr)
        const endDate = new Date(startDate)
        endDate.setHours(startDate.getHours() + 1);

        const startDateInMinutes = minutesBetweenDates(baseDate, startDate)
        const endDateInMinutes = minutesBetweenDates(baseDate, endDate)

        for (let i = startDateInMinutes; i <= endDateInMinutes; i++) {
            histrogram[i] = forecast.cloudcover
        }
    })

    return histrogram
}

function minutesBetweenDates(baseDate, date) {
    return Math.floor((date - baseDate) / (1000 * 60))
}

function offsetDateByMinutes(baseDate, range) {
    return new Date(range * 60 * 1000 + baseDate)
}

function computeVisibility(ephimeres, cloudcover, cloudCoverThreshold) {
    let visibilityHistogram = Array(ephimeres.length).fill(1)

    for (let i = 0; i < ephimeres.length; i++) {
        if (cloudcover[i] < cloudCoverThreshold) {
            visibilityHistogram[i] = ephimeres[i]
        }
    }

    return visibilityHistogram
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

export function rateInterval(start, end, ephimeresHistograms, weatherHistogram) {
    let maxEphimeresScores = Array(ephimeresHistograms.length).fill(0)

    for (let i = start; i <= end; i++) {
        if (weatherHistogram[i] > 0) {
            for (let j = 0; j < ephimeresHistograms.length; j++) {
                if (ephimeresHistograms[j][i] > maxEphimeresScores[j]) {
                    maxEphimeresScores[j] = ephimeresHistograms[j][i]
                }
            }
        }        
    }

    return maxEphimeresScores.reduce((acc, curr) => acc + curr)
}

export async function getStarEphimeres(lattitude, longitude, stars) {
    return new Promise(async (resolve, reject) => {
        const currentDate = new Date().toISOString().split('T')[0]

        let params = new URLSearchParams(usnoParams)
        params.set('lat', lattitude)
        params.set('lon', longitude)
        params.set('date', currentDate)

        const promises = stars.map(objectId => {
            params.set('body', objectId)
            const url = usnoEndpoint + params.toString()
            return fetch(url)
        });

        const usnoResponses = await Promise.all(promises)
        const htmls = await Promise.all(usnoResponses.map(r => r.text()))
        const data = htmls.map(html => new JSDOM(html).window.document.querySelector('pre').textContent)
        const allIntervals = data.map(rawText => convertEphimeresToIntervals(rawText))

        const histrograms = allIntervals.map(intervals => getEphimeresHistogram(intervals))
        resolve(histrograms)
    })
}

export async function getWeatherData(lattitude, longitude) {
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

export function stargazingForecastThreshold(
    {
        start,
        end,
        ephimeresHistograms,
        cloudCoverHistogram,
        starIds,
        cloudCoverThreshold=30
    }) {
    const currentDate = new Date()
    const baseDate = currentDate.setUTCHours(0, 0, 0, 0)

    let night = {
        sunset: offsetDateByMinutes(baseDate, start),
        sunrise: offsetDateByMinutes(baseDate, end),
        stars: []
    }

    const relevantCloudCoverHistogram = cloudCoverHistogram.slice(start, end)
    const avgCloudCover = relevantCloudCoverHistogram.reduce((acc, curr) => acc + curr) / relevantCloudCoverHistogram.length
    
    night.cloudCover = avgCloudCover

    ephimeresHistograms.forEach((ephimeres, index) => {
        const visibilityHistogram = computeVisibility(
            ephimeres.slice(start, end),
            relevantCloudCoverHistogram,
            cloudCoverThreshold
        )

        const startOfVisibility = startOf(visibilityHistogram)
        const endOfVisibility = endOf(visibilityHistogram)

        if (startOfVisibility) {
            let star = {
                name: indexToStar[starIds[index]],
                rise: offsetDateByMinutes(baseDate, startOfVisibility + start)
            }

            if (endOfVisibility) star.set = offsetDateByMinutes(baseDate, endOfVisibility + start)

            night.stars.push(star)
        }
    })

    return night
}

export function stargazingForecast(
    {
        start,
        end,
        ephimeresHistograms,
        cloudCoverHistogram,
        starIds
    }) {
    const currentDate = new Date()
    const baseDate = currentDate.setUTCHours(0, 0, 0, 0)

    let forecast = {
        sunset: offsetDateByMinutes(baseDate, start),
        sunrise: offsetDateByMinutes(baseDate, end),
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
                name: indexToStar[starIds[index]],
                rise: offsetDateByMinutes(baseDate, startOfVisibility + start)
            }

            if (endOfVisibility) star.set = offsetDateByMinutes(baseDate, endOfVisibility + start)

            forecast.stars.push(star)
        }
    })

    return forecast
}
