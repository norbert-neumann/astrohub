import { createApp } from '../app.js'
import request from 'supertest'

let mockedRepository = {
    users: {},
    spots: {},
    trips: {}
}

const fakeUserAuthMiddleware = (req, res, next) => {
    next()
}

describe('/users', () => {

    it('get request with valid parameters returns status code 200', async () => {
        const app = createApp(mockedRepository, fakeUserAuthMiddleware)
        const body = {
        }

        const response = await request(app).get('/users/66294184df84fa9924995bbb').send(body)
        console.log(response.body)

        expect(response.statusCode).toBe(200)
    })
})
