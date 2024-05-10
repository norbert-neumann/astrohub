function createTripController(repository) {
    const getUpcomingTrips = async (req, res) => {
        const origin = req.body.origin
        const maxDistance = req.body.distance || undefined
        const result = await repository.getUpcomingTrips(origin, maxDistance)
        res.send(result)
    }

    const getTripById = async (req, res) => {
        const trip = await repository.getTripById(req.params.tripId)
        res.send(trip)
    }

    const createTrip = async (req, res) => {
        const newTrip = {
            spotId: req.body.spotId,
            date: req.body.date,
            name: req.body.name
        }
        const result = await repository.saveTrip(newTrip)
        res.send(result)
    }

    const updateName = async (req, res) => {
        const tripId = req.params.tripId
        const newName = req.body.newName
        let result = await repository.updateName(tripId, newName)
        res.send(result)
    }

    const updateDate = async (req, res) => {
        const tripId = req.params.tripId
        const newDate = req.body.newDate
        let result = await repository.updateDate(tripId, newDate)
        res.send(result)
    }

    const deleteTrip = async (req, res) => {
        await repository.deleteTrip(req.params.tripId)
        res.send({data: 'DELETE trip'})
    }

    return {
        getUpcomingTrips,
        getTripById,
        createTrip,
        updateName,
        updateDate,
        deleteTrip
    }
}

export default createTripController
