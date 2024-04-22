import express from 'express'
import userRouter from './routes/user.js'
import spotRouter from './routes/spot.js'
import tripRouter from './routes/trip.js'
import forecastRouter from './routes/forecast.js'

const app = express()

app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))

app.use('/user', userRouter)
app.use('spot', spotRouter)
app.use('trip', tripRouter)
app.use('forecast', forecastRouter)

app.listen(3000, () => console.log('listening at 3000'))