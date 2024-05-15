import { JSDOM } from 'jsdom'
import dateService from './dateService.js'

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
            const intervals = data.map(rawText => convertEphimeresToIntervals(rawText))

            resolve(intervals)
        })
    },

    getTestEphimeres: async () => {
        const response = await fetch('https://aa.usno.navy.mil/calculated/mrst')
        return await response.text()
    }
}


function convertEphimeresToIntervals(rawText) {
    const lines = rawText.split('\n')
    const riseSetTable = lines.slice(16, lines.length - 3)

    let intervals = []
    let rise, set
    let skippedDays = 0

    for (let day = 0; day < riseSetTable.length; day++) {
        const correctedDay = day - skippedDays
        const row = riseSetTable[day]
        rise = row.substring(25, 30)
        set = row.substring(59, 64)

        if (rise.trim()) {
            let riseInMinutes = dateService.convertToMinutes(correctedDay, rise)
            let setInMinutes = dateService.convertToMinutes(correctedDay, set)

            if (riseInMinutes > setInMinutes) {
                setInMinutes = dateService.convertToMinutes(correctedDay + 1, set)
            }
            intervals.push([riseInMinutes, setInMinutes, 1])
        }
        else {
            skippedDays++
        }
    }

    return intervals
}

export default ephimeresService