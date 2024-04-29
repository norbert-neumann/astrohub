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
        getByUserId(userId) {
            return usersCollection.findOne(
                {_id: userId},
            )
        },

        async getFriends(userId) {
            const user = await usersCollection.findOne({_id: userId})
            return Promise.all(user.friends
                .map(id => usersCollection.findOne({_id: new ObjectId(id)})))
        },

        async getFriendRequests(userId) {
            const user = await usersCollection.findOne({_id: userId})
            return Promise.all(user.friendRequests
                .map(id => usersCollection.findOne({_id: new ObjectId(id)})))
        },

        async getFavouriteSpots(userId) {
            const user = await usersCollection.findOne({_id: userId})
            return Promise.all(user.favouriteSpots
                .map(id => spotsCollection.findOne({_id: new ObjectId(id)})))
        },

        async getTrips(userId) {
            const user = await usersCollection.findOne({_id: userId})
            return Promise.all(user.trips
                .map(id => tripsCollection.findOne({_id: new ObjectId(id)})))
        },

        updateUsername(userId, newUsername) {
            return usersCollection.updateOne(
                {_id: userId},
                {$set: {username: newUsername}}
            )
        },

        updateDisplayName(userId, newDisplayName) {
            return usersCollection.updateOne(
                {_id: userId},
                {$set: {displayName: newDisplayName}}
            )
        },

        addToFavouriteSpots(userId, spotId) {
            usersCollection.updateOne(
                {_id: userId},
                {$addToSet: {favouriteSpots: spotId}}
            )
        },

        removeFromFavouriteSpots(userId, spotId) {
            usersCollection.updateOne(
                {_id: userId},
                {$pull: {favouriteSpots: spotId}}
            )
        },

        addToTrips(userId, tripId) {
            usersCollection.updateOne(
                {_id: userId},
                {$addToSet: {trips: tripId}}
            )
        },

        removeFromTrips(userId, tripId) {
            usersCollection.updateOne(
                {_id: userId},
                {$pull: {trips: tripId}}
            )
        },

        addToFriendRequests(userId, senderId) {
            usersCollection.updateOne(
                {_id: userId},
                {$addToSet: {friendRequests: senderId}}
            )
        },

        removeFromFriendRequests(userId, senderId) {
            usersCollection.updateOne(
                {_id: userId},
                {$pull: {friendRequests: senderId}}
            )
        },

        addToFriends(userId, friendId) {
            usersCollection.updateOne(
                {_id: userId},
                {$addToSet: {friends: friendId}}
            )
        },

        removeFromFriends(userId, friendId) {
            usersCollection.updateOne(
                {_id: userId},
                {$pull: {friends: friendId}}
            )
        },

        async saveUser(user) {
            await usersCollection.insertOne(user)
        },

        async deleteUser(userId) {
            await usersCollection.deleteOne({_id: userId})
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