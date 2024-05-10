function createUserController(repository) {
    const getUser = async (req, res) => {
        console.log('params: ' + req.params.userId)
        const user = await repository.getUserById(req.params.userId)
        res.send(user)
    }

    const getFriends = async (req, res) => {
        const user = await repository.getFriends(req.params.userId)
        res.send(user)
    }

    const getFriendRequests = async (req, res) => {
        const user = await repository.getFriendRequests(req.params.userId)
        res.send(user)
    }

    const getFavouriteSpots = async (req, res) => {
        const user = await repository.getFavouriteSpots(req.params.userId)
        res.send(user)
    }

    const getTrips = async (req, res) => {
        const user = await repository.getTrips(req.params.userId)
        res.send(user)
    }

    const addFriend = async (req, res) => {
        const senderId = req.params.userId
        const friendId = req.body.friendId
        repository.addToFriends(senderId, friendId)
        res.send({data: 'POST add friend'})
    }

    const addTrip = async (req, res) => {
        const userId = req.params.userId
        const tripId = req.body.tripId
        repository.addToTrips(userId, tripId)
        res.send({data: 'POST add trip'})
    }

    const addFavouriteSpot = async (req, res) => {
        const userId = req.params.userId
        const spotId = req.body.spotId
        repository.addToFavouriteSpots(userId, spotId)
        res.send({data: 'POST add favourite spot'})
    }

    const addFriendRequest = async (req, res) => {
        const senderId = req.params.userId
        const friendId = req.body.friendId
        repository.addToFriendRequests(friendId, senderId)
        res.send({data: 'POST add friend request'})
    }

    const updateUsername = async (req, res) => {
        let userId = req.params.userId
        let newUsername = req.body.newUsername
        let result = await repository.updateUsername(userId, newUsername)
        res.send(result)
    }

    const updateDisplayName = async (req, res) => {
        let userId = req.params.userId
        let newDisplayName = req.body.newDisplayName
        let result = await repository.updateDisplayName(userId, newDisplayName)
        res.send(result)
    }

    const deleteUser = async (req, res) => {
        const result = await repository.deleteUser(req.params.userId)
        res.send(result)
    }

    const removeFriend = async (req, res) => {
        const userId = req.params.userId
        const friendId = req.body.friendId
        repository.removeFromFriends(userId, friendId)
        res.send({data: 'DELETE remove friend'})
    }

    const removeTrip = async (req, res) => {
        const userId = req.params.userId
        const tripId = req.body.tripId
        repository.removeFromTrips(userId, tripId)
        res.send({data: 'DELETE remove trip'})
    }

    const removeFavouriteSpot = async (req, res) => {
        const userId = req.params.userId
        const spotId = req.body.spotId
        repository.removeFromFavouriteSpots(userId, spotId)
        res.send({data: 'DELETE remove favourite spot'})
    }

    const removeFriendRequest = async (req, res) => {
        const userId = req.params.userId
        const senderId = req.body.senderId
        repository.removeFromFriendRequests(userId, senderId)
        res.send({data: 'DELETE remove friend request'})
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
