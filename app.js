import express from 'express'
import userRouter from './routes/user.js'
import spotRouter from './routes/spot.js'
import tripRouter from './routes/trip.js'
import forecastRouter from './routes/forecast.js'

export function createApp(repository) {
    const app = express()
    
    app.use(express.static('public'))
    app.use(express.json({limit: '1mb'}))

    app.use('/users', userRouter(repository))
    app.use('/spots', spotRouter(repository))
    app.use('/trips', tripRouter(repository))
    app.use('/forecast', forecastRouter(repository))

    return app
}