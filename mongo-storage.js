import {MongoClient, ObjectId} from 'mongodb'

export async function connectToMongo(serverUrl) {
    const db = new MongoClient(serverUrl).db('AstroDb')
    const usersCollection = db.collection('users')
    const spotsCollection = db.collection('spots')
    const tripsCollection = db.collection('trips')

    usersCollection.createIndex({username: 1}, {unique: true})
    spotsCollection.createIndex({lattitude: 1, longitude: 1}, {unique: true})
    tripsCollection.createIndex({spotId: 1, date: 1}, {unique: true})

    return {
        getUserByUsername(username) {
            return usersCollection.findOne(
                {username},
            )
        },

        updateUsername(currentUsername, newUsername) {
            return usersCollection.updateOne(
                {username: currentUsername},
                {$set: {username: newUsername}}
            )
        },

        addToFavouriteSpots(username, spot) {
            usersCollection.updateOne(
                {username},
                {$addToSet: {favouriteSpots: spot._id}}
            )
        },

        removeFromFavouriteSpots(username, spot) {
            usersCollection.updateOne(
                {username},
                {$pull: {favouriteSpots: spot._id}}
            )
        },

        addToUpcomingTrips(username, trip) {
            usersCollection.updateOne(
                {username},
                {$addToSet: {trips: trip._id}}
            )
        },

        removeFromUpcomingTrips(username, trip) {
            usersCollection.updateOne(
                {username},
                {$pull: {trips: trip._id}}
            )
        },

        addToFriendRequests(username, user) {
            usersCollection.updateOne(
                {username},
                {$addToSet: {friendRequests: user._id}}
            )
        },

        removeFromFriendRequests(username, user) {
            usersCollection.updateOne(
                {username},
                {$pull: {friendRequests: user._id}}
            )
        },

        addToFriends(username, friend) {
            usersCollection.updateOne(
                {username},
                {$addToSet: {friends: friend._id}}
            )
        },

        removeFromFriends(username, friend) {
            usersCollection.updateOne(
                {username},
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

        getSpotByLocation(location) {
            return spotsCollection.findOne(
                {
                    lattitude: location.lattitude,
                    longitude: location.longitude
                }
            )
        },

        updateName(location, newName) {
            spotsCollection.updateOne(
                {
                    lattitude: location.lattitude,
                    longitude: location.longitude
                },
                {$set: {name: newName}}
            )
        },

        updateLightPollution(location, pollutionValue) {
            spotsCollection.updateOne(
                {
                    lattitude: location.lattitude,
                    longitude: location.longitude
                },
                {$set: {lightPollution: pollutionValue}}
            )
        },

        updateRating(location, newRating) {
            spotsCollection.updateOne(
                {
                    lattitude: location.lattitude,
                    longitude: location.longitude
                },
                {$set: {rating: newRating}} //TODO: use something else instead of $set?
            )
        },

        async saveSpot(spot) {
            await spotsCollection.insertOne(spot)
        },

        deleteSpot(location) {
            spotsCollection.deleteOne({
                lattitude: location.lattitude,
                longitude: location.longitude
            })
        },

        //-----------------------TRIPS-----------------------\\

        getAllTrips() {
            return tripsCollection.find().toArray()
        },

        updateTripName(spotId, date, newName) {
            tripsCollection.updateOne(
                {spotId, date},
                {$set: {name: newName}}
            )
        },

        updateTripLocation(currentSpotId, date, newSpotId) {
            tripsCollection.updateOne(
                {
                    spotId: new ObjectId(currentSpotId),
                    date: date
                },
                {$set: {spotId: new ObjectId(newSpotId)}}
            )
        },

        updateTripDate(spotId, currentDate, newDate) {
            tripsCollection.updateOne(
                {
                    spotId: spotId,
                    date: currentDate
                },
                {$set: {date: newDate}}
            )
        },

        async saveTrip(trip) {
            await tripsCollection.insertOne(trip)
        },

        deleteTrip(spotId, date) {
            tripsCollection.deleteOne({spotId, date})
        }
    }
}