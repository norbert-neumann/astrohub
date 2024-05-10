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


        updateName(spotId, newName) {
            spotsCollection.updateOne(
                {_id: ObjectId.createFromHexString(spotId)},
                {$set: {name: newName}}
            )
        },

        updateLightPollution(spotId, pollutionValue) {
            spotsCollection.updateOne(
                {_id: ObjectId.createFromHexString(spotId)},
                {$set: {lightPollution: pollutionValue}}
            )
        },

        updateName(spotId, newName) {
            spotsCollection.updateOne(
                {_id: ObjectId.createFromHexString(spotId)},
                {$set: {name: newName}}
            )
        },

        updateRating(spotId, newRating) {
            spotsCollection.updateOne(
                {_id: ObjectId.createFromHexString(spotId)},
                {$set: {rating: newRating}} //TODO: use something else instead of $set?
            )
        },

        async saveSpot(spot) {
            await spotsCollection.insertOne(spot)
        },

        deleteSpot(spotId) {
            spotsCollection.deleteOne({_id: ObjectId.createFromHexString(spotId)})
        }
    }
}