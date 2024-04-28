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

        async getFriends(username) {
            const user = await usersCollection.findOne({username})
            return Promise.all(user.friends
                .map(id => usersCollection.findOne({_id: new ObjectId(id)})))
        },

        async getFriendRequests(username) {
            const user = await usersCollection.findOne({username})
            return Promise.all(user.friendRequests
                .map(id => usersCollection.findOne({_id: new ObjectId(id)})))
        },

        async getFavouriteSpots(username) {
            const user = await usersCollection.findOne({username})
            return Promise.all(user.favouriteSpots
                .map(id => spotsCollection.findOne({_id: new ObjectId(id)})))
        },

        async getTrips(username) {
            const user = await usersCollection.findOne({username})
            return Promise.all(user.trips
                .map(id => tripsCollection.findOne({_id: new ObjectId(id)})))
        },

        updateUsername(currentUsername, newUsername) {
            return usersCollection.updateOne(
                {username: currentUsername},
                {$set: {username: newUsername}}
            )
        },

        updateDisplayName(username, newDisplayName) {
            return usersCollection.updateOne(
                {username},
                {$set: {displayName: newDisplayName}}
            )
        },

        addToFavouriteSpots(username, spotId) {
            usersCollection.updateOne(
                {username},
                {$addToSet: {favouriteSpots: spotId}}
            )
        },

        removeFromFavouriteSpots(username, spotId) {
            usersCollection.updateOne(
                {username},
                {$pull: {favouriteSpots: spotId}}
            )
        },

        addToTrips(username, tripId) {
            usersCollection.updateOne(
                {username},
                {$addToSet: {trips: tripId}}
            )
        },

        removeFromUpcomingTrips(username, tripId) {
            usersCollection.updateOne(
                {username},
                {$pull: {trips: tripId}}
            )
        },

        addToFriendRequests(username, userId) {
            usersCollection.updateOne(
                {username},
                {$addToSet: {friendRequests: userId}}
            )
        },

        removeFromFriendRequests(username, userId) {
            usersCollection.updateOne(
                {username},
                {$pull: {friendRequests: userId}}
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

        async deleteUser(username) {
            await usersCollection.deleteOne({username})
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