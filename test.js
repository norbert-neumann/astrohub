import { JSDOM } from 'jsdom';

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

async function getHtml() {
    const response = await fetch('https://aa.usno.navy.mil/calculated/mrst?body=10&date=2024-03-26&reps=15&lat=0.0000&lon=0.0000&label=&tz=0.00&tz_sign=-1&height=0&submit=Get+Data')
    const html = await response.text()
    
    const dom = new JSDOM(html)
    return dom.window.document.querySelector('pre').textContent
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

export function maskOutHistogram(start, end, histrogram) {
    let newHistrogram = [...histrogram]
    
    for (let i = start; i <= end; i++) {
        newHistrogram[i] = 0
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
        nightInvervals.push([dateToRange(baseDate, riseSetTimes[i]), dateToRange(baseDate, riseSetTimes[i + 1])])   
    }

    return nightInvervals
}

function convertSunEphimeresToIntervals(rawText) {
    const lines = rawText.split('\n')
    const riseSetTable = lines.slice(17, lines.length - 3)

    let intervals = []
    let rise, set

    for (let day = 0; day < riseSetTable.length - 1; day++) {
        const row = riseSetTable[day];
        const nextRow = riseSetTable[day + 1]
        set = row.substring(71, 76)
        rise = nextRow.substring(20, 25)

        if (rise.trim()) {
            let setInMinutes = convertToMinutes(day, set)
            let riseInMinutes = convertToMinutes(day + 1, rise)

            intervals.push([setInMinutes, riseInMinutes])
        }
    }

    return intervals
}

function convertToMinutes(day, timeString) {
    const [hours, minutes] = timeString.split(':')
    return day * 1440 + Number(hours) * 60 + Number(minutes)
}

function countIntervalIntersections(nightInterval, objectInterval) {
    let intersectionCounts = []

    for (let i = 0; i < nightInterval.length; i++) {
       const night = nightInterval[i]
       const count = objectInterval.filter(interval => 
            (interval[0] > night[0] && interval[0] < night[1]) ||
            (interval[1] > night[0] && interval[1] < night[1])
       ).length
       intersectionCounts.push(count)
    }

    return intersectionCounts
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

export function getWeatherHistogram(baseDate, clearSkyDateStrings) {
    let histrogram = Array(27360).fill(0)

    for (const dateString of clearSkyDateStrings) {
        const startDate = new Date(dateString)
        const endDate = new Date(startDate)
        endDate.setHours(startDate.getHours() + 1);

        const startInterval = dateToRange(baseDate, startDate)
        const endInterval = dateToRange(baseDate, endDate)

        for (let i = startInterval; i <= endInterval; i++) {
            histrogram[i] = 1
        }
    }


    return histrogram
}

function dateToRange(baseDate, date) {
    return Math.floor((date - baseDate) / (1000 * 60))
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

export async function getEphimeres(lattitude, longitude, stars) {
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

export async function getWeather(lattitude, longitude) {
    return new Promise(async (resolve, reject) => {
    
        const location = [lattitude, longitude].join(',')
        const currentDate = new Date()
        const baseDate = currentDate.setUTCHours(0, 0, 0, 0)

        let params =  new URLSearchParams(visualCrossingParams)
        params.set('locations', location)
        const url = visualCrossingEndpoint + '?' + params.toString()

        let weatherResponse = await fetch(url)
        let weatherData = await weatherResponse.json()

        let clearSkyDateStrings = weatherData.locations[location].values.filter(value => value.cloudcover < 30.0).map(value => value.datetimeStr)
        let weatherHistogram = getWeatherHistogram(baseDate, clearSkyDateStrings)
        let nightIntervals = getNightIntervals(baseDate, weatherData.locations[location].values)

        resolve({histogram: weatherHistogram, nights: nightIntervals})
    })
}