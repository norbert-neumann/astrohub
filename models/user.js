import { ObjectId } from "mongodb"

export default function createUserFunctions(usersCollection, spotsCollection, tripsCollection) {
    return {
        getUserById(userId) {
            return usersCollection.findOne(
                {_id: new ObjectId(userId)},
            )
        },

        async getFriends(userId) {
            const result = await usersCollection.aggregate([
                {
                    $match: {
                        _id: new ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "friends",
                        foreignField: "_id",
                        as: "friends"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        friends: 1
                    }
                }
            ]).toArray()
            
            return result[0]
        },

        async getFriendRequests(userId) {
            const result = await usersCollection.aggregate([
                {
                    $match: {
                        _id: new ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "friendRequests",
                        foreignField: "_id",
                        as: "friendRequests"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        friendRequests: 1
                    }
                }
            ]).toArray()
            
            return result[0]
        },

        async getFavouriteSpots(userId) {
            const result = await usersCollection.aggregate([
                {
                    $match: {
                        _id: new ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "spots",
                        localField: "favouriteSpots",
                        foreignField: "_id",
                        as: "favouriteSpots"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        favouriteSpots: 1
                    }
                }
            ]).toArray()
            
            return result[0]
        },

        async getTrips(userId) {
            const result = await usersCollection.aggregate([
                {
                    $match: {
                        _id: new ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "trips",
                        localField: "trips",
                        foreignField: "_id",
                        as: "trips"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        trips: 1
                    }
                }
            ]).toArray()

            return result[0]
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