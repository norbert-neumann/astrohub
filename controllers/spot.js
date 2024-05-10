function createSpotController(repository) {
    
    const getSpotsSortedByDistance = async (req, res) => {
        const origin = req.body.origin
        const distanceInKm = req.body.distance || undefined
        const result = await repository.getSpotsSortedByDistanceIncludeDistance(origin, distanceInKm)
        res.send(result)
    }

    const getAllSpotsSortedByRating = async (req, res) => {
        const skip = req.body.skip || undefined
        const limit = req.body.limit || undefined
        const direction = req.body.orderBy === 'asc' ? 1 : -1
        const sort = {rating: direction}
        const spots = await repository.getAllSpots({sort, skip, limit})
        res.send(spots)
    }

    const getSpotsByPartialName = async (req, res) => {
        const spots = await repository.getSpotsByPartialName(req.params.name)
        res.send(spots)
    }

    const getSpotById = async (req, res) => {
        const spot = await repository.getSpotById(req.params.spotId)
        res.send(spot)
    }

    const getSpotsWithinDistance = async (req, res) => {
        const origin = req.body.origin
        const distanceInKm = req.body.distance || undefined
        const spots = await repository.getSpotsWithinDistance(origin, distanceInKm)
        res.send(spots)
    }

    const createSpot = async (req, res) => {
        const spot = {
            location: [req.body.lattitude, req.body.longitude],
            name: req.body.name,
            rating: 0,
            lightPollution: req.body.lightPollution || undefined
        }
        repository.saveSpot(spot)
        res.send({data: 'POST spot'})
    }

    const updateName = async (req, res) => {
        const spotId = req.params.spotId
        const newName = req.body.newName
        repository.updateName(spotId, newName)
        res.send({data: 'PATCH spot-name'})
    }
    
    const updateRating = async (req, res) => {
        const spotId = req.params.spotId
        const newRating = req.body.newRating
        repository.updateRating(spotId, newRating)
        res.send({data: 'PATCH spot-rating'})
    }

    const deleteSpot = async (req, res) => {
        const result = await repository.deleteSpot(req.params.spotId)
        res.send(result)
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
