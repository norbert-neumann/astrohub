import { ObjectId } from "mongodb"

export default function createSpotFunctions(spotsCollection) {
    return {

         // TODO: pagination, sort by distance and/or rating
         getAllSpots(sort, skip, limit) {
            return spotsCollection.find()
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray()
        },

        getSpotById(spotId) {
            return spotsCollection.findOne({_id: spotId})
        },

        getSpotsByName(name) {
            return spotsCollection.find({name}).toArray()
        },

        getSpotsByPartialName(partialName) {
            const nameRegex = new RegExp(partialName, 'i');
            const filter = { name: { $regex: nameRegex } };
            const sort = { name: 1 };
            //return this.getAllSpots(filter, sort, undefined, undefined)
            return spotsCollection.find(filter).sort(sort).toArray()
        },

        getSpotsSortedByDistance(point, maxDistance) {
            return spotsCollection.find(
                {
                    location: { $nearSphere :
                        {
                          $geometry: { type: "Point",  coordinates: point },
                          $maxDistance: maxDistance
                        }
                     }
                }
            ).toArray()
        },

        getSpotsSortedByDistanceIncludeDistance(point, maxDistance) {
            return spotsCollection.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: point
                        },
                        distanceField: "distance",
                        maxDistance: maxDistance,
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
                {_id: spotId},
                {$set: {name: newName}}
            )
        },

        updateLightPollution(spotId, pollutionValue) {
            spotsCollection.updateOne(
                {_id: spotId},
                {$set: {lightPollution: pollutionValue}}
            )
        },

        updateRating(spotId, newRating) {
            spotsCollection.updateOne(
                {_id: spotId},
                {$set: {rating: newRating}} //TODO: use something else instead of $set?
            )
        },

        async saveSpot(spot) {
            await spotsCollection.insertOne(spot)
        },

        deleteSpot(spotId) {
            spotsCollection.deleteOne({_id: spotId})
        }
    }
}