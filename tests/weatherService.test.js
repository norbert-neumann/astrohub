import fetchMock from 'jest-fetch-mock'
import weatherService from '../services/weatherService.js'
import mockedResponses from '../mocked-data/visual-crossing-responses.js'

describe('weatherService', () => {
    beforeEach(() => {
        fetchMock.enableMocks()
    })

    afterEach(() => {
        fetchMock.resetMocks()
    })

    it('should return expected weather intervals', async () => {
        fetchMock.mockResponseOnce(mockedResponses.response)
        const expectedFirstWeatherIntervals = [960, 1020, 50.0]

        const {weatherIntervals, nightItervals} = await weatherService.getWeatherData(0, 0)

        expect(Array.isArray(weatherIntervals)).toBe(true)
        expect(weatherIntervals.length).toBe(25) // 25, since we have 25 hours of weather data
        expect(weatherIntervals[0].length).toBe(3) // 3, since one entry should contain the [start, end, cloudcover] values
        expect(weatherIntervals[0]).toStrictEqual(expectedFirstWeatherIntervals)
    }),

    it('should return expected night intervals', async () => {
        fetchMock.mockResponseOnce(mockedResponses.response)
        const expectedNightIntervals = [
            [1110, 1615]
        ]

        const {weatherIntervals, nightIntervals} = await weatherService.getWeatherData(0, 0)

        expect(Array.isArray(nightIntervals)).toBe(true)
        expect(nightIntervals.length).toBe(1) // 1, since we have 1 day amount of weather data
        expect(nightIntervals[0].length).toBe(2) // 2, since one night interval contains [start, end] values
        expect(nightIntervals).toStrictEqual(expectedNightIntervals)
    })
})
