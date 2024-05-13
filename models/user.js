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

        async getOrCreate(user) {
            user._id = ObjectId.createFromHexString(user._id.toString())

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

        async getTrips_(userId) {
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

        async getTrips(userId, timezone='UTC') {
            // Match user by userId
            const matchStage = {
                $match: { _id: ObjectId.createFromHexString(userId) }
            };
        
            // Lookup trips associated with the user
            const lookupStage = {
                $lookup: {
                    from: "trips",
                    localField: "trips",
                    foreignField: "_id",
                    as: "trips"
                }
            };
        
            // Project only 'trips' field and exclude '_id'
            const projectStage1 = {
                $project: { _id: 0, trips: 1 }
            };
        
            // Convert dates in 'trips' to the desired timezone
            const convertTimezoneStage = {
                $addFields: {
                    trips: {
                        $map: {
                            input: "$trips",
                            as: "trip",
                            in: {
                                $mergeObjects: [
                                    "$$trip",
                                    {
                                        date: {
                                            $dateToString: {
                                                date: "$$trip.date",
                                                timezone
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            };
        
            // Final project to exclude all fields except 'trips'
            const projectStage2 = {
                $project: { trips: 1 }
            };
        
            // Execute aggregation pipeline
            const result = await usersCollection.aggregate([
                matchStage,
                lookupStage,
                projectStage1,
                convertTimezoneStage,
                projectStage2
            ]).toArray();
        
            return result[0];
        },
        
        // Maybe add try-catch here to catch duplicate errors
        // Or just show the error in the result and let the controller call next(err)?
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

        async addToFavouriteSpots(userId, spotId) {
            const spotObjectId = ObjectId.createFromHexString(spotId)
            const spot = await spotsCollection.findOne({_id: spotObjectId})

            if (spot) {
                const result = await usersCollection.updateOne(
                    {_id: ObjectId.createFromHexString(userId)},
                    {$addToSet: {spots: spotObjectId}})
                return {exists: true, alreadyAdded: result.modifiedCount === 0}
            }
            return {exists: false, alreadyAdded: false}
        },

        async removeFromFavouriteSpots(userId, spotId) {
            const result = await usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$pull: {spots: ObjectId.createFromHexString(spotId)}}
            )
            return {found: result.modifiedCount > 0}
        },

        async addToTrips(userId, tripId) {
            const tripObjectId = ObjectId.createFromHexString(tripId)
            const trip = await tripsCollection.findOne({_id: tripObjectId})

            if (trip) {
                const result = await usersCollection.updateOne(
                    {_id: ObjectId.createFromHexString(userId)},
                    {$addToSet: {trips: tripObjectId}})
                return {exists: true, alreadyAdded: result.modifiedCount === 0}
            }
            return {exists: false, alreadyAdded: false}
        },

        async removeFromTrips(userId, tripId) {
            const result = await usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$pull: {trips: ObjectId.createFromHexString(tripId)}}
            )
            return {found: result.modifiedCount > 0}
        },

        async addToFriendRequests(userId, senderId) {
            const receiver = await this.getUserById(userId)

            if (receiver) {
                const senderObjectId = ObjectId.createFromHexString(senderId)
                if (receiver.friends.some(friendId => friendId.equals(senderObjectId))) {
                    return {exists: true, alreadyFriend: true, alreadySent: false}
                }
                else {
                    const result = await usersCollection.updateOne(
                        {_id: ObjectId.createFromHexString(userId)},
                        {$addToSet: {friendRequests: senderObjectId}}
                    )
                    return {exists: true, alreadyFriend: false, alreadySent: result.modifiedCount === 0}
                }
            }

            return {exists: false, alreadyFriend: false, alreadySent: false}
        },

        async removeFromFriendRequests(userId, senderId) {
            const result = await usersCollection.updateOne(
                {_id: ObjectId.createFromHexString(userId)},
                {$pull: {friendRequests: ObjectId.createFromHexString(senderId)}}
            )
            return {found: result.modifiedCount > 0}
        },

        async addToFriends(userId, friendId) {
            const friend = await this.getUserById(friendId)

            if (friend) {
                const result = await usersCollection.updateOne(
                    {_id: ObjectId.createFromHexString(userId)},
                    {$addToSet: {friends: ObjectId.createFromHexString(friendId)}})

                console.log(result)
                return {exists: true, alreadyFriend: result.modifiedCount === 0}
            }
            return {exists: false, alreadyFriend: false}
        },

        async removeFromFriends(userId, friendId) {
            const result = await usersCollection.updateOne(
                {_id: userId},
                {$pull: {friends: ObjectId.createFromHexString(friendId)}}
            )
            return {found: result.modifiedCount > 0}
        },

        async saveUser(user) {
            return await usersCollection.insertOne(user, {$project: {_id: 1}})
        },

        async deleteUser(userId) {
            await usersCollection.deleteOne({_id: ObjectId.createFromHexString(userId)})
        },
    }
}