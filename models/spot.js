import { ObjectId } from "mongodb"

export default function createSpotFunctions(spotsCollection) {
    return {

         getAllSpots({filter={}, sort={}, skip=0, limit=0}) {
            return spotsCollection.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray()
        },

        getSpotById(spotId) {
            return spotsCollection.findOne({_id: ObjectId.createFromHexString(spotId)})
        },

        getSpotsByName(name) {
            return spotsCollection.find({name}).toArray()
        },

        getSpotsWithinDistance(origin, distanceInKm=50.0) {
            const pointP = { type: "Point", coordinates: [origin.longitude, origin.lattitude] }
            const filter = {
                location: {
                    $geoWithin: {
                        $centerSphere: [pointP.coordinates, distanceInKm / 6371]
                    }
                }
            }
            return this.getAllSpots({filter, sort: {rating: -1}})
        },

        getSpotsByPartialName(partialName) {
            const nameRegex = new RegExp(partialName, 'i')
            const filter = { name: { $regex: nameRegex } }
            const sort = { name: 1 }
            return this.getAllSpots({filter, sort})
        },

        getSpotsSortedByDistanceIncludeDistance(origin, maxDistanceInKm=30.0) {
            return spotsCollection.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [origin.longitude, origin.lattitude]
                        },
                        distanceField: "distance",
                        maxDistance: maxDistanceInKm * 1000,
                        spherical: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        name: 1,
                        location: 1,
                        distance: 1
                    }
                }
            ]).toArray();
        },

        async updateName(spotId, newName) {
            const result = await spotsCollection.updateOne(
                {_id: ObjectId.createFromHexString(spotId)},
                {$set: {name: newName}}
            )
            return {changed: result.modifiedCount > 0}
        },

        async updateRating(spotId, newRating) {
            const result = await spotsCollection.updateOne(
                {_id: ObjectId.createFromHexString(spotId)},
                {$set: {rating: newRating}}
            )
            return {changed: result.modifiedCount > 0}
        },

        async saveSpot(spot) {
            const geoLocation = {
                type: "Point",
                coordinates: [spot.longitude, spot.lattitude]
            }
            spot.location = geoLocation
            delete spot.lattitude
            delete spot.longitude
            return await spotsCollection.insertOne(spot, {$project: {_id: 1}})
        },

        async deleteSpot(spotId) {
            const result = await spotsCollection.deleteOne({_id: ObjectId.createFromHexString(spotId)})
            return {deleted: result.deletedCount > 0}
        }
    }
}