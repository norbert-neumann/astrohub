function createTripController(repository) {

    const getUpcomingTrips = async (req, res, next) => {
        try {
            const origin = req.body.origin
            const maxDistance = req.body.distance || undefined
            const timezone = req.body.timezone || undefined
            const result = await repository.getUpcomingTrips(origin, maxDistance, timezone)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const getTripById = async (req, res, next) => {
        try {
            const timezone = req.body.timezone || undefined
            const trip = await repository.getTripById(req.params.tripId, timezone)
            res.send(trip)
        } catch (error) {
            next(error)
        }
    }

    const createTrip = async (req, res, next) => {
        try {
            const newTrip = {
                spotId: req.body.spotId,
                date: new Date(req.body.date),
                name: req.body.name
            }
            const result = await repository.saveTrip(newTrip)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const updateName = async (req, res, next) => {
        try {
            const tripId = req.params.tripId
            const newName = new Date(req.body.newName)
            let result = await repository.updateName(tripId, newName)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const updateDate = async (req, res, next) => {
        try {
            const tripId = req.params.tripId
            const newDate = req.body.newDate
            let result = await repository.updateDate(tripId, newDate)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const deleteTrip = async (req, res, next) => {
        try {
            await repository.deleteTrip(req.params.tripId)
            res.send({data: 'DELETE trip'})
        } catch (error) {
            next(error)
        }
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
