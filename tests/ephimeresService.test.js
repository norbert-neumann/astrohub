import fetchMock from 'jest-fetch-mock'
import ephimeresService from '../services/ephimeresService.js'
import mockedResponses from '../mocked-data/usno-responses.js'

describe('ephimeresService', () => {
    beforeEach(() => {
        fetchMock.enableMocks()
    })

    afterEach(() => {
        fetchMock.resetMocks()
    })

    it('should return an empty array given no stars', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = []
        fetchMock.mockResponseOnce(mockedResponses.singleRowResponse)

        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(0)
    }),

    it('should return an interval in a length=1 array given one star', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = [0]
        fetchMock.mockResponseOnce(mockedResponses.singleRowResponse)

        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)

        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(1) // 1, since we only queried 1 star
        expect(result[0].length).toBe(1) // 1, since the mockedResponse has only one row
        expect(result[0][0].length).toBe(3) // 3, since this is the interval with the [start, end, 1] values
    }),

    it('should return an 10 invervals given 10 stars', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = []
        for (let i = 0; i < 10; i++) {
            stars.push(i)
            fetchMock.mockResponse(mockedResponses.singleRowResponse)
        }

        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(10) // 10, since we queried 10 stars
        result.forEach(arr => expect(arr.length).toBe(1)) // 1, since the mockedResponse has only one row
        result.forEach(arr => expect(arr[0].length).toBe(3)) // , since this is the interval with the [start, end, 1] values
    }),

    it('should return expected interval given a simple response', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = [0]
        const expectedInterval = [600, 605, 1] // [10 hours, 10 hours + 5 minutes] in minutes
        fetchMock.mockResponseOnce(mockedResponses.singleRowResponse)


        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(1)
        expect(result[0][0]).toStrictEqual(expectedInterval)
    }),

    it('should return expected interval given a day boundary crossing response', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = [0]
        const expectedInterval = [1439, 1441, 1] // [23h + 59min, 23h + 59min + 2min] in minutes
        fetchMock.mockResponseOnce(mockedResponses.singleRowResponseWithDayBoundaryCross)


        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(1)
        expect(result[0][0]).toStrictEqual(expectedInterval)
    }),

    it('should return expected intervals given multi row response', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = [0]
        const expectedIntervals = [
            [635, 1470, 1],
            [2071, 2906, 1],
            [3507, 4342, 1],
        ]
        fetchMock.mockResponseOnce(mockedResponses.multiRowResponse)


        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(3)
        expect(result[0]).toStrictEqual(expectedIntervals)
    }),

    it('should return expected intervals given multi row response with invalid row', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = [0]
        const expectedIntervals = [
            [607, 1442, 1],
            [2043, 2874, 1],
        ]
        fetchMock.mockResponseOnce(mockedResponses.multiRowResponseWithInvalidRow)


        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)

        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(2)
        expect(result[0]).toStrictEqual(expectedIntervals)
    })
})
