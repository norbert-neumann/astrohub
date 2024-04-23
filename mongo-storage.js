import {MongoClient} from 'mongodb'

export async function connectToMongo(serverUrl) {
    const db = new MongoClient(serverUrl).db('AstroDb')
    const usersCollection = db.collection('users')
    const spotsCollection = db.collection('spots')
    const tripsCollection = db.collection('trips')

    return {
        getUserByUsername(username) {
            return usersCollection.findOne(
                {username},
                {projection: {_id: 0}}
            )
        },

        updateUsername(currentUsername, newUsername) {
            // TODO: somehow ask the db to check if newUsername
            // is already taken
            usersCollection.updateOne(
                {username: currentUsername},
                {$set: {username: newUsername}}
            )
        },

        addToFavouriteSpot(username, spot) {

        },

        removeFromFavouriteSpot(username, spot) {
            
        },

        addToUpcomingTrips(username, trip) {

        },

        removeFromUpcomingTrips(username, trip) {

        },

        addToFriendRequests(username, user) {

        },

        removeFromFriendRequests(username, user) {
            
        },

        async saveUser(user) {
            await usersCollection.insertOne(user)
        },

        deleteUser(user) {
            usersCollection.deleteOne(user)
        },

        //-----------------------SPOTS-----------------------\\

        // TODO: pagination, sort by distance and/or rating
        getAllSpots() {
            return spotsCollection.find().toArray()
        },

        getSpotByName(name) {
            return spotsCollection.findOne(
                {name},
                {projection: {_id: 0}}
            )
        },

        updateName(currentName, newName) {
            spotsCollection.updateOne(
                {name: currentName},
                {$set: {name: newName}}
            )
        },

        updateLightPollution(name, pollutionValue) {
            spotsCollection.updateOne(
                {name},
                {$set: {lightPollution: pollutionValue}}
            )
        },

        updateRating(name, newRating) {
            spotsCollection.updateOne(
                {name},
                {$set: {rating: newRating}} //TODO: use something else instead of $set?
            )
        },

        async saveSpot(spot) {
            await spotsCollection.insertOne(spot)
        },

        deleteSpot(name) {
            spotsCollection.deleteOne({name})
        },

        //-----------------------TRIPS-----------------------\\

        getAllPublicTrips() {

        },

        updateTripName(currentName, newName) {
            tripsCollection.updateOne(
                {name: currentName},
                {$set: {name: newName}}
            )
        },

        updateTripDate(name, newDate) {
            tripsCollection.updateOne(
                {name},
                {$set: {date: newDate}}
            )
        },

        updateTripVisibility(name, newVisibility) {
            tripsCollection.updateOne(
                {name},
                {$set: {isPublic: newVisibility}}
            )
        },

        async saveTrip(trip) {
            await tripsCollection.insertOne(trip)
        },

        deleteTrip(name) {
            tripsCollection.deleteOne({name})
        }
    }
}