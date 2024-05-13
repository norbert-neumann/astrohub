import { createApp } from '../app.js'
import request from 'supertest'
import fetchMock from 'jest-fetch-mock'
import mockedUsnoResponses from '../mocked-data/usno-responses.js'
import mockedVisualCrossingResponses from '../mocked-data/visual-crossing-responses.js'

let mockedRepository = {
    users: {},
    spots: {},
    trips: {}
}

const fakeUserAuthMiddleware = (req, res, next) => {
    next()
}

describe('/forecast', () => {
    beforeEach(() => {
        fetchMock.enableMocks()
    })

    afterEach(() => {
        fetchMock.resetMocks()
    })

    it.skip('get request with valid parameters returns status code 200', async () => {
        fetchMock.mockOnceIf(
            (req) => req.url.includes('https://aa.usno.navy.mil/calculated/mrst'),
            mockedUsnoResponses.singleRowMarsResponse
        )
        fetchMock.mockOnceIf(
            (req) => req.url.includes('https://weather.visualcrossing.com/VisualCrossingWebServices'),
            mockedVisualCrossingResponses.response
        )
        const app = createApp(mockedRepository, fakeUserAuthMiddleware)
        const body = {
            lattitude: 0,
            longitude: 0,
            stars: ['Mars']
        }

        const response = await request(app).get('/forecast').send(body)

        expect(response.statusCode).toBe(200)
    })

    it.skip('get request with high threshold returns expected results', async () => {
        fetchMock.mockOnceIf(
            (req) => req.url.includes('https://aa.usno.navy.mil/calculated/mrst'),
            mockedUsnoResponses.singleRowMarsResponse
        )
        fetchMock.mockOnceIf(
            (req) => req.url.includes('https://weather.visualcrossing.com/VisualCrossingWebServices'),
            mockedVisualCrossingResponses.response
        )
        const app = createApp(mockedRepository, fakeUserAuthMiddleware)
        const body = {
            lattitude: 0,
            longitude: 0,
            stars: ['Mars'],
            threshold: 50.01
        }
        const expectedResponseBody = [
            {
                sunset: 'Sunday, May 12, 2024 at 6:30:00 PM UTC',
                sunrise: 'Monday, May 13, 2024 at 2:55:00 AM UTC',
                stars:  [
                    {
                        name: 'Mars',
                        rise: 'Sunday, May 12, 2024 at 10:00:00 PM UTC',
                        set: 'Monday, May 13, 2024 at 2:54:00 AM UTC'
                    }
                ],
                cloudCoverPct: '50.00'
            }
        ]

        const response = await request(app).get('/forecast').send(body)

        expect(response.body).toStrictEqual(expectedResponseBody)
    }),

    it.skip('get request with default cloud cover threshold returns empty array', async () => {
        fetchMock.mockOnceIf(
            (req) => req.url.includes('https://aa.usno.navy.mil/calculated/mrst'),
            mockedUsnoResponses.singleRowMarsResponse
        )
        fetchMock.mockOnceIf(
            (req) => req.url.includes('https://weather.visualcrossing.com/VisualCrossingWebServices'),
            mockedVisualCrossingResponses.response
        )
        const app = createApp(mockedRepository, fakeUserAuthMiddleware)
        const body = {
            lattitude: 0,
            longitude: 0,
            stars: ['Mars']
        }
        const expectedResponseBody = []

        const response = await request(app).get('/forecast').send(body)

        expect(response.body).toStrictEqual(expectedResponseBody)
    })
})
