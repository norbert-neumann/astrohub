import {MongoClient} from 'mongodb'

export async function connectToMongo(serverUrl) {
    const db = new MongoClient(serverUrl).db('AstroDb')
    const usersCollection = db.collection('users')
    const spotsCollection = db.collection('spots')
    const tripsCollection = db.collection('trips')

    return {
        getUserByUsername(username) {
            return usersCollection.findOne(
                {_id: username},
            )
        },

        updateUsername(currentUsername, newUsername) {
            // TODO: somehow ask the db to check if newUsername
            // is already taken
            usersCollection.updateOne(
                {_id: currentUsername},
                {$set: {_id: newUsername}}
            )
        },

        addToFavouriteSpot(username, spot) {
            usersCollection.updateOne(
                {_id: username},
                {$addToSet: {favouriteSpots: spot._id}}
            )
        },

        removeFromFavouriteSpot(username, spot) {
            usersCollection.updateOne(
                {_id: username},
                {$pull: {favouriteSpots: spot._id}}
            )
        },

        addToUpcomingTrips(username, trip) {
            usersCollection.updateOne(
                {_id: username},
                {$addToSet: {trips: trip._id}}
            )
        },

        removeFromUpcomingTrips(username, trip) {
            usersCollection.updateOne(
                {_id: username},
                {$pull: {trips: trip._id}}
            )
        },

        addToFriendRequests(username, user) {
            usersCollection.updateOne(
                {_id: username},
                {$addToSet: {friendRequests: user._id}}
            )
        },

        removeFromFriendRequests(username, user) {
            usersCollection.updateOne(
                {_id: username},
                {$pull: {friendRequests: user._id}}
            )
        },

        addToFriends(username, friend) {
            usersCollection.updateOne(
                {_id: username},
                {$addToSet: {friends: friend._id}}
            )
        },

        removeFromFriends(username, friend) {
            usersCollection.updateOne(
                {_id: username},
                {$pull: {friends: friend._id}}
            )
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
                {name}
            )
        },

        updateName(location, newName) {
            spotsCollection.updateOne(
                {_id: location},
                {$set: {name: newName}}
            )
        },

        updateLightPollution(location, pollutionValue) {
            spotsCollection.updateOne(
                {_id: location},
                {$set: {lightPollution: pollutionValue}}
            )
        },

        updateRating(location, newRating) {
            spotsCollection.updateOne(
                {_id: location},
                {$set: {rating: newRating}} //TODO: use something else instead of $set?
            )
        },

        async saveSpot(spot) {
            await spotsCollection.insertOne(spot)
        },

        deleteSpot(location) {
            spotsCollection.deleteOne({_id: location})
        },

        //-----------------------TRIPS-----------------------\\

        getAllPublicTrips() {

        },

        updateTripName(date, spotId, newName) {
            tripsCollection.updateOne(
                {name: {date, spotId}},
                {$set: {name: newName}}
            )
        },

        updateTripDate(currentDate, spotId, newDate) {
            tripsCollection.updateOne(
                {_id: {currentDate, spotId}},
                {$set: {_id: {newDate, spotId}}}
            )
        },

        updateTripVisibility(date, spotId, newVisibility) {
            tripsCollection.updateOne(
                {_id: {date, spotId}},
                {$set: {isPublic: newVisibility}}
            )
        },

        async saveTrip(trip) {
            await tripsCollection.insertOne(trip)
        },

        deleteTrip(date, spotId) {
            tripsCollection.deleteOne({date, spotId})
        }
    }
}