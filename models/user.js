import { ObjectId } from "mongodb"

export default function createUserFunctions(usersCollection, spotsCollection, tripsCollection) {
    return {
        getUserById(userId) {
            return usersCollection.findOne(
                {_id: ObjectId.createFromHexString(userId)},
            )
        },

        getUserByUsername(username) {
            return usersCollection.findOne({username})
        },

        // TODO: convert user._id to ObjectId
        async getOrCreate(user) {
            const options = {
                upsert: true,
                returnOriginal: false
            }

            const result = await usersCollection.findOneAndUpdate(
                {_id: user._id},
                {$setOnInsert: user},
                options
            )

            return result?.value || user
        },

        async getFriends(userId) {
            const result = await usersCollection.aggregate([
                {
                    $match: {
                        _id: ObjectId.createFromHexString(userId)
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
                        _id: ObjectId.createFromHexString(userId)
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
                        _id: ObjectId.createFromHexString(userId)
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
                        _id: ObjectId.createFromHexString(userId)
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
                {_id: ObjectId.createFromHexString(userId)},
                {$set: {username: newUsername}}
            )
        },

        updateDisplayName(userId, newDisplayName) {
            return usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$set: {displayName: newDisplayName}}
            )
        },

        addToFavouriteSpots(userId, spotId) {
            usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$addToSet: {favouriteSpots: ObjectId.createFromHexString(spotId)}}
            )
        },

        removeFromFavouriteSpots(userId, spotId) {
            usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$pull: {favouriteSpots: ObjectId.createFromHexString(spotId)}}
            )
        },

        addToTrips(userId, tripId) {
            usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$addToSet: {trips: ObjectId.createFromHexString(tripId)}}
            )
        },

        removeFromTrips(userId, tripId) {
            usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$pull: {trips: ObjectId.createFromHexString(tripId)}}
            )
        },

        addToFriendRequests(userId, senderId) {
            usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$addToSet: {friendRequests: ObjectId.createFromHexString(senderId)}}
            )
        },

        removeFromFriendRequests(userId, senderId) {
            usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$pull: {friendRequests: ObjectId.createFromHexString(senderId)}}
            )
        },

        addToFriends(userId, friendId) {
            usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$addToSet: {friends: ObjectId.createFromHexString(friendId)}}
            )
        },

        removeFromFriends(userId, friendId) {
            usersCollection.updateOne(
                {_id: userId},
                {$pull: {friends: ObjectId.createFromHexString(friendId)}}
            )
        },

        async saveUser(user) {
            return await usersCollection.insertOne(user, {$project: {_id: 1}})
        },

        async deleteUser(userId) {
            await usersCollection.deleteOne({_id: ObjectId.createFromHexString(userId)})
        },
    }
}