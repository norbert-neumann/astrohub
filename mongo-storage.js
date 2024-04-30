import {MongoClient} from 'mongodb'
import createUserFunctions from './models/user.js'
import createSpotFunctions from './models/spot.js'
import createTripFunctions from './models/trip.js'

export async function connectToMongo(serverUrl) {
    const db = new MongoClient(serverUrl).db('AstroDb')

    const usersCollection = db.collection('users')
    const spotsCollection = db.collection('spots')
    const tripsCollection = db.collection('trips')

    usersCollection.createIndex({username: 1}, {unique: true})
    spotsCollection.createIndex({location: '2dsphere'}, {unique: true})
    tripsCollection.createIndex({spotId: 1, date: 1}, {unique: true})

    const userFunctions = createUserFunctions(usersCollection, spotsCollection, tripsCollection)
    const spotFunctions = createSpotFunctions(spotsCollection)
    const tripFunctions = createTripFunctions(tripsCollection)

    return {
        users: userFunctions,
        spots: spotFunctions,
        trips: tripFunctions
    }
}