function createSpotController(repository) {
    
    const getSpotsSortedByDistance = async (req, res, next) => {
        try {
            const origin = req.body.origin
            const distanceInKm = req.body.distance || undefined
            const result = await repository.getSpotsSortedByDistanceIncludeDistance(origin, distanceInKm)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const getAllSpotsSortedByRating = async (req, res, next) => {
        try {
            const skip = req.body.skip || undefined
            const limit = req.body.limit || undefined
            const direction = req.body.orderBy === 'asc' ? 1 : -1
            const sort = {rating: direction}
            const spots = await repository.getAllSpots({sort, skip, limit})
            res.send(spots)
        } catch (error) {
            next(error)
        }
    }

    const getSpotsByPartialName = async (req, res, next) => {
        try {
            const spots = await repository.getSpotsByPartialName(req.params.name)
            res.send(spots)
        } catch (error) {
            next(error)
        }
    }

    const getSpotById = async (req, res, next) => {
        try {
            const spot = await repository.getSpotById(req.params.spotId)
            res.send(spot)
        } catch (error) {
            next(error)
        }
    }

    const getSpotsWithinDistance = async (req, res) => {
        try {
            const origin = req.body.origin
            const distanceInKm = req.body.distance || undefined
            const spots = await repository.getSpotsWithinDistance(origin, distanceInKm)
            res.send(spots)
        } catch (error) {
            next(error)
        }
    }

    const createSpot = async (req, res, next) => {
        try {
            const spot = {
                lattitude: req.body.lattitude,
                longitude: req.body.longitude,
                name: req.body.name,
                rating: 0,
                lightPollution: req.body.lightPollution || undefined
            }
            await repository.saveSpot(spot)
            res.send({data: 'POST spot'})
        } catch (error) {
            next(error)
        }
    }

    const updateName = async (req, res, next) => {
        try {
            const spotId = req.params.spotId
            const newName = req.body.name
            await repository.updateName(spotId, newName)
            res.send({data: 'PATCH spot-name'})
        } catch (error) {
            next(error)
        }
    }
    
    const updateRating = async (req, res, next) => {
        try {
            const spotId = req.params.spotId
            const newRating = req.body.newRating
            await repository.updateRating(spotId, newRating)
            res.send({data: 'PATCH spot-rating'})
        } catch (error) {
            next(error)
        }
    }

    const deleteSpot = async (req, res, next) => {
        try {
            const result = await repository.deleteSpot(req.params.spotId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    return {
        getSpotsSortedByDistance,
        getAllSpotsSortedByRating,
        getSpotsByPartialName,
        getSpotById,
        getSpotsWithinDistance,
        createSpot,
        updateName,
        updateRating,
        deleteSpot
    }
}

export default createSpotController
