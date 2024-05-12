import fetchMock from 'jest-fetch-mock';
import ephimeresService from '../services/ephimeresService.js';
import mockedResponses from '../mocked-data/usno-responses.js'

const expectedResultLength = 27360

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

    it('should return an array with length=1 and expected sub-array length given one star', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = [0]
        fetchMock.mockResponseOnce(mockedResponses.singleRowResponse)

        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(expectedResultLength)
    }),

    it('should return an array with length=10 expected sub-array lengths given 10 stars', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = []
        for (let i = 0; i < 10; i++) {
            stars.push(i)
            fetchMock.mockResponse(mockedResponses.singleRowResponse)
        }

        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(10)
        result.forEach(arr => expect(arr.length).toBe(expectedResultLength))
    }),

    it('should return expected ephimeres', async () => {
        const lattitude = 0.0
        const longitude = 0.0
        const stars = [0]
        const expectedStart = 600 // -> 10 hours in minutes
        const expectedEnd = 605 // -> 10 hours and 5 minutes
        fetchMock.mockResponseOnce(mockedResponses.singleRowResponse)


        const result = await ephimeresService.getStarEphimeres(lattitude, longitude, stars)
        const start = startOf(result[0])
        const end = endOf(result[0])
        
        expect(Array.isArray(result)).toBe(true)
        expect(result.length).toBe(1)
        expect(start).toBe(expectedStart)
        expect(end).toBe(expectedEnd)
    })
})
