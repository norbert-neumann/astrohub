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
        it('patch request with too short newUsername parameter returns status code 400', async () => {
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)
            const body = {
                newUsername: 'abcde' // invalid, since a username must have a length of 6 or more
            }

            const response = await request(app)
                .patch('/users/66294184df84fa9924995bbb/username')
                .send(body)

            expect(response.statusCode).toBe(400)
        })

        it('patch request with a newUsername parameter of sufficient length should return status code 200', async () => {
            mockedRepository.users.updateUsername = jest.fn((userId, newUsername) => {})
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)
            const body = {
                newUsername: 'abcdef'
            }

            const response = await request(app)
                .patch('/users/66294184df84fa9924995bbb/username')
                .send(body)

            expect(response.statusCode).toBe(200)
        }),

        it('patch request with too long newUsername parameter returns status code 400', async () => {
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)
            const body = {
                newUsername: 'a'.repeat(31) // invalid, since a username must have a length of 30 or less
            }

            const response = await request(app)
                .patch('/users/66294184df84fa9924995bbb/username')
                .send(body)

            expect(response.statusCode).toBe(400)
        }),

        it('patch request with a newUsername parameter containing exactly the upper bound number of characters should return status code 200', async () => {
            mockedRepository.users.updateUsername = jest.fn((userId, newUsername) => {})
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)
            const body = {
                newUsername: 'a'.repeat(30)
            }

            const response = await request(app)
                .patch('/users/66294184df84fa9924995bbb/username')
                .send(body)

            expect(response.statusCode).toBe(200)
        }),

        it('patch request with empty request body should return status code 400', async () => {
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)

            const response = await request(app)
                .patch('/users/66294184df84fa9924995bbb/username')
                .send({})

            expect(response.statusCode).toBe(400)
        }),

        it('patch request with valid newUsername should call the updateUsername function once, with the expected parameters', async () => {
            mockedRepository.users.updateUsername = jest.fn((userId, newUsername) => {})
            const app = createApp(mockedRepository, fakeUserAuthMiddleware)
            const body = {
                newUsername: 'validUsername'
            }

            const response = await request(app)
                .patch('/users/0123/username')
                .send(body)

            expect(response.statusCode).toBe(200)
            expect(mockedRepository.users.updateUsername).toHaveBeenCalled()
            expect(mockedRepository.users.updateUsername).toHaveBeenCalledTimes(1)
            expect(mockedRepository.users.updateUsername).toHaveBeenCalledWith('0123', 'validUsername')
        })
    })
})
