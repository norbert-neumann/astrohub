import { JSDOM } from 'jsdom'
import dateService from "./dateService.js"

const usnoEndpoint = 'https://aa.usno.navy.mil/calculated/mrst?'
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

const ephimeresService = {
    getStarEphimeres: (lattitude, longitude, stars) => {
        return new Promise(async (resolve, reject) => {
            const currentDate = new Date().toISOString().split('T')[0]

            let params = new URLSearchParams(usnoParams)
            params.set('lat', lattitude)
            params.set('lon', longitude)
            params.set('date', currentDate)

            const ephimeresRequests = stars.map(objectId => {
                params.set('body', objectId)
                const url = usnoEndpoint + params.toString()
                return fetch(url)
            });

            const responses = await Promise.all(ephimeresRequests)
            const htmls = await Promise.all(responses.map(r => r.text()))
            const data = htmls.map(html => new JSDOM(html).window.document.querySelector('pre').textContent)
            const allIntervals = data.map(rawText => convertEphimeresToIntervals(rawText))

            const histrograms = allIntervals.map(intervals => getEphimeresHistogram(intervals))
            resolve(histrograms)
        })
    }
}


function convertEphimeresToIntervals(rawText) {
    const lines = rawText.split('\n')
    const riseSetTable = lines.slice(16, lines.length - 3)

    let intervals = []
    let rise, set

    for (let day = 0; day < riseSetTable.length; day++) {
        const row = riseSetTable[day];
        rise = row.substring(25, 30)
        set = row.substring(59, 64)

        if (rise.trim()) {
            let riseInMinutes = dateService.convertToMinutes(day, rise)
            let setInMinutes = dateService.convertToMinutes(day, set)

            if (riseInMinutes > setInMinutes) {
                setInMinutes = dateService.convertToMinutes(day + 1, set)
            }
            intervals.push([riseInMinutes, setInMinutes])
        }
    }

    return intervals
}


function getEphimeresHistogram(intervals) {
    let histrogram = Array(27360).fill(0)

    for (const interval of intervals) {
        for (let i = interval[0]; i <= interval[1]; i++) {
            histrogram[i] = 1
        }
    }

    return histrogram
}

export default ephimeresService