import { ObjectId } from "mongodb"

export default function createUserFunctions(usersCollection, spotsCollection, tripsCollection) {
    return {
        getUserById(userId) {
            return usersCollection.findOne(
                {_id: new ObjectId(userId)},
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
    }
}