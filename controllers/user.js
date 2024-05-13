function createUserController(repository) {

    const getUser = async (req, res, next) => {
        try {
            const user = await repository.getUserById(req.params.userId)
            res.send(user)
        } catch (error) {
            next(error)
        }
    }

    const getFriends = async (req, res, next) => {
        try {
            const user = await repository.getFriends(req.params.userId)
            res.send(user)
        } catch (error) {
            next(error)
        }
    }

    const getFriendRequests = async (req, res) => {
        try {
            const user = await repository.getFriendRequests(req.params.userId)
            res.send(user)
        } catch (error) {
            next(error)
        }
    }

    const getFavouriteSpots = async (req, res) => {
        try {
            const user = await repository.getFavouriteSpots(req.params.userId)
            res.send(user)
        } catch (error) {
            next(error)
        }
    }

    const getTrips = async (req, res) => {
        try {
            const timezone = req.body.timezone
            const result = await repository.getTrips(req.params.userId, timezone)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const addFriend = async (req, res, next) => {
        try {
            const senderId = req.params.userId
            const friendId = req.body.friendId
            const result = await repository.addToFriends(senderId, friendId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const addTrip = async (req, res, next) => {
        try {
            const userId = req.params.userId
            const tripId = req.body.tripId
            const result = await repository.addToTrips(userId, tripId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const addFavouriteSpot = async (req, res, next) => {
        try {
            const userId = req.params.userId
            const spotId = req.body.spotId
            const result = await repository.addToFavouriteSpots(userId, spotId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const addFriendRequest = async (req, res, next) => {
        try {
            const senderId = req.params.userId
            const friendId = req.body.friendId
            const result = await repository.addToFriendRequests(friendId, senderId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const updateUsername = async (req, res, next) => {
        try {
            let userId = req.params.userId
            let newUsername = req.body.newUsername
            let result = await repository.updateUsername(userId, newUsername)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const updateDisplayName = async (req, res) => {
        try {
            let userId = req.params.userId
            let newDisplayName = req.body.newDisplayName
            let result = await repository.updateDisplayName(userId, newDisplayName)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const deleteUser = async (req, res, next) => {
        try {
            const result = await repository.deleteUser(req.params.userId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const removeFriend = async (req, res, next) => {
        try {
            const userId = req.params.userId
            const friendId = req.body.friendId
            const result = await repository.removeFromFriends(userId, friendId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const removeTrip = async (req, res, next) => {
        try {
            const userId = req.params.userId
            const tripId = req.body.tripId
            const result = await repository.removeFromTrips(userId, tripId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const removeFavouriteSpot = async (req, res, next) => {
        try {
            const userId = req.params.userId
            const spotId = req.body.spotId
            const result = await repository.removeFromFavouriteSpots(userId, spotId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    const removeFriendRequest = async (req, res, next) => {
        try {
            const userId = req.params.userId
            const senderId = req.body.senderId
            const result = await repository.removeFromFriendRequests(userId, senderId)
            res.send(result)
        } catch (error) {
            next(error)
        }
    }

    return {
        getUser,
        getFriends,
        getFriendRequests,
        getFavouriteSpots,
        getTrips,
        addFriend,
        addTrip,
        addFavouriteSpot,
        addFriendRequest,
        updateUsername,
        updateDisplayName,
        deleteUser,
        removeFriend,
        removeTrip,
        removeFavouriteSpot,
        removeFriendRequest
    }
}

export default createUserController
