import { ObjectId } from "mongodb"

export default function createTripFunctions(tripsCollection) {
    return {
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