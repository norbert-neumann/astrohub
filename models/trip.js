import { ObjectId } from "mongodb"

export default function createTripFunctions(tripsCollection, spotsCollection) {
    return {
        getAllTrips() {
            return tripsCollection.find().toArray()
        },

        async getUpcomingTrips(origin, distanceInKm=50.0) {
            const geoOrigin = {
                type: "Point",
                coordinates: [origin.longitude, origin.lattitude]
            }

            const spotsWithinDistance = await spotsCollection.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [geoOrigin.coordinates, distanceInKm / 6371]
                    }
                }
            }).toArray();

            const upcomingTrips = await tripsCollection.aggregate([
                {
                    $lookup: {
                        from: "spots",
                        localField: "spotId",
                        foreignField: "_id",
                        as: "spots"
                    }
                },
                {
                    $match: {
                      $and: [
                        { "spots": { $in: spotsWithinDistance } },
                        { date: { $gt: new Date() } }
                      ]
                    }
                  },
                {
                    $unwind: "$spots"
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        spot: "$spots"
                    }
                }
            ]).sort({date: 1}).toArray()

            return upcomingTrips
        },

        getTripById(tripId) {
            return tripsCollection.findOne({_id: tripId})
        },

        updateTripName(tripId, newName) {
            tripsCollection.updateOne(
                {_id: tripId},
                {$set: {name: newName}}
            )
        },

        updateDate(tripId, newDate) {
            tripsCollection.updateOne(
                {_id: tripId},
                {$set: {date: newDate}}
            )
        },

        async saveTrip(trip) {
            await tripsCollection.insertOne(trip)
        },

        deleteTrip(tripId) {
            tripsCollection.deleteOne({_id: tripId})
        }
    }
}