import 'dotenv/config'
import express from 'express'
import userRouter from './routes/user.js'
import spotRouter from './routes/spot.js'
import tripRouter from './routes/trip.js'
import authRouter from './routes/auth.js'
import forecastRouter from './routes/forecast.js'
import cookieParser from 'cookie-parser'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import passport from 'passport'
import { errorHandler } from './errorHandling.js'

export function createApp(repository, userAuthMiddleware) {

    const app = express()
    
    app.use(passport.initialize())
    app.use(cookieParser())
    app.use(express.static('public'))
    app.use(express.json({limit: '1mb'}))
    app.use(express.urlencoded())
    const __dirname = dirname(fileURLToPath(import.meta.url))
    app.set('views', join(__dirname, './views'))
    app.set('view engine', 'hjs')

    app.use('/auth', authRouter(repository.users, passport))
    app.use('/users', userRouter(repository.users, userAuthMiddleware))
    app.use('/spots', spotRouter(repository.spots))
    app.use('/trips', tripRouter(repository.trips))
    app.use('/forecast', forecastRouter(repository))

    app.use(errorHandler)

    return app
}