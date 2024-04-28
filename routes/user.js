import express from 'express'

function createUserRouter(repository) {
    const router = express.Router()

    router.get('/:username', async (req, res) => {
        const user = await repository.getUserByUsername(req.params.username)
        res.send(user)
    })

    router.get('/:username/friends', async (req, res) => {
        const user = await repository.getFriends(req.params.username)
        res.send(user)
    })

    router.get('/:username/friend-requests', async (req, res) => {
        const user = await repository.getFriendRequests(req.params.username)
        res.send(user)
    })

    router.get('/:username/favourite-spots', async (req, res) => {
        const user = await repository.getFavouriteSpots(req.params.username)
        res.send(user)
    })

    router.get('/:username/trips', async (req, res) => {
        const user = await repository.getTrips(req.params.username)
        res.send(user)
    })

    router.post('/', async (req, res) => {
        const user = {
            username: req.body.username,
            displayName: req.body.displayName,
            favouriteSpots: [],
            trips: [],
            friends: [],
            friendRequests: []
        }
        repository.saveUser(user)
        res.send({data: 'POST user'})
    })

    router.post('/:username/friends', async (req, res) => {
        const username = req.params.username
        const friendId = req.body.friendId
        repository.addToFriends(username, friendId)
        res.send({data: 'POST add friend'})
    })

    router.post('/:username/trips', async (req, res) => {
        const username = req.params.username
        const tripId = req.body.tripId
        repository.addToTrips(username, tripId)
        res.send({data: 'POST add trip'})
    })

    router.post('/:username/favourite-spots', async (req, res) => {
        const username = req.params.username
        const spotId = req.body.spotId
        repository.addToFavouriteSpots(username, spotId)
        res.send({data: 'POST add favourite spot'})
    })

    router.post('/:userId/friend-requests/', async (req, res) => {
        const userId = req.params.userId
        const friendId = req.body.friendId
        repository.addToFriendRequests(friendId, userId)
        res.send({data: 'POST add friend request'})
    })

    // TODO: patch esetén is okés req.body-t használni?
    router.patch('/:username/username', async (req, res) => {
        let currentUsername = req.params.username
        let newUsername = req.body.newUsername
        let result = await repository.updateUsername(currentUsername, newUsername)
        res.send(result)
    })

    router.patch('/:username/displayName', async (req, res) => {
        let username = req.params.username
        let newDisplayName = req.body.newDisplayName
        let result = await repository.updateDisplayName(username, newDisplayName)
        res.send(result)
    })

    router.delete('/:username', async (req, res) => {
        const result = await repository.deleteUser(req.params.username)
        res.send(result)
    })

    router.delete('/:username/friend', async (req, res) => {
        const username = req.params.username
        const friendId = req.body.friendId
        repository.removeFromFriends(username, friendId)
        res.send({data: 'DELETE remove friend'})
    })

    router.delete('/:userId/trips', async (req, res) => {
        res.send({data: 'DELETE remove trip'})
    })

    router.delete('/:userId/favourite-spots', async (req, res) => {
        res.send({data: 'DELETE remove  favourite spot'})
    })

    router.delete('/:userId/friend-requests', async (req, res) => {
        res.send({data: 'DELETE remove  friend request'})
    })

    return router
}

export default createUserRouter