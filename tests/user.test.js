import { createApp } from '../app.js'
import request from 'supertest'
import jest from 'jest-mock'

let mockedRepository = {
    users: {},
    spots: {},
    trips: {}
}

const fakeUserAuthMiddleware = (req, res, next) => {
    next()
}

describe('/users', () => {
    
    describe('GET /:userId', () => {

        it('get request with valid parameters returns status code 200', async () => {
            mockedRepository.users.getUserById = jest.fn((userId) => ({ result: 'mocked getUserById response' }))
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)

            const response = await request(app).get('/users/66294184df84fa9924995bbb')

            expect(response.statusCode).toBe(200)
        }),

        it('get request with valid parameters returns expected result', async () => {
            mockedRepository.users.getUserById = jest.fn((userId) => ({ result: 'mocked getUserById response' }))
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)

            const response = await request(app).get('/users/66294184df84fa9924995bbb')

            expect(response.body.result).toStrictEqual('mocked getUserById response')
        }),

        it('get request with valid parameters should call getUserById once, with the expected parameter', async () => {
            mockedRepository.users.getUserById = jest.fn((userId) => ({ result: 'mocked getUserById response' }))
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)

            const response = await request(app).get('/users/66294184df84fa9924995bbb')

            expect(mockedRepository.users.getUserById).toHaveBeenCalled()
            expect(mockedRepository.users.getUserById).toHaveBeenCalledTimes(1)
            expect(mockedRepository.users.getUserById).toHaveBeenCalledWith('66294184df84fa9924995bbb')
        })    
    })

    describe('PATCH /:userId/username', () => {
        it('patch request with invalid request body returns status code 400', async () => {
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)
            const body = {
                newUsername: 'abc' // invalid, since a username must have a length of 6 or more
            }

            const response = await request(app)
                .patch('/users/66294184df84fa9924995bbb/username')
                .send(body)

            expect(response.statusCode).toBe(400)
        })
    })
})
