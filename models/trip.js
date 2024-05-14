import { ObjectId } from "mongodb"

export default function createTripFunctions(tripsCollection, spotsCollection) {
    return {
        getAllTrips() {
            return tripsCollection.find().toArray()
        },

        async getUpcomingTrips(origin, distanceInKm=50.0, timezone='UTC') {
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
                        from: 'spots',
                        localField: 'spotId',
                        foreignField: '_id',
                        as: 'spots'
                    }
                },
                {
                    $match: {
                      $and: [
                        { 'spots': { $in: spotsWithinDistance } },
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
                        date: { $dateToString: { date: '$date', timezone } },
                        spot: '$spots'
                    }
                }
            ]).sort({date: 1}).toArray()

            return upcomingTrips
        },

        getTripById(tripId, timezone='UTC') {
            return tripsCollection.findOne(
                {_id: ObjectId.createFromHexString(tripId)},
                {
                    projection: {
                        _id: 1,
                        spotId: 1,
                        date: { $dateToString: { date: '$date', timezone } },
                        name: 1
                    }
                }
            );
        },

        updateName(tripId, newName) {
            return tripsCollection.updateOne(
                {_id: ObjectId.createFromHexString(tripId)},
                {$set: {name: newName}}
            )
        },

        updateDate(tripId, newDate) {
            return tripsCollection.updateOne(
                {_id: ObjectId.createFromHexString(tripId)},
                {$set: {date: newDate}}
            )
        },

        async saveTrip(trip) {
            await tripsCollection.insertOne(trip)
        },

        async deleteTrip(tripId) {
            const result = await tripsCollection.deleteOne({_id: ObjectId.createFromHexString(tripId)})
            return {deleted: result.deletedCount > 0}
        }
    }
}