import express from 'express'
import validate from '../validator.js'
import { displayNameSchema, userSchema, usernameSchema } from '../schema.js'

function createUserRouter(repository) {
    const router = express.Router()

    router.get('/:userId', async (req, res) => {
        const user = await repository.getUserById(req.params.userId)
        res.send(user)
    })

    router.get('/:userId/friends', async (req, res) => {
        const user = await repository.getFriends(req.params.userId)
        res.send(user)
    })

    router.get('/:userId/friend-requests', async (req, res) => {
        const user = await repository.getFriendRequests(req.params.userId)
        res.send(user)
    })

    router.get('/:userId/favourite-spots', async (req, res) => {
        const user = await repository.getFavouriteSpots(req.params.userId)
        res.send(user)
    })

    router.get('/:userId/trips', async (req, res) => {
        const user = await repository.getTrips(req.params.userId)
        res.send(user)
    })

    router.post('/', validate(userSchema), async (req, res) => {
        const user = {
            username: req.body.username,
            displayName: req.body.displayName,
            favouriteSpots: [],
            trips: [],
            friends: [],
            friendRequests: []
        }
        //repository.saveUser(user)
        res.send({data: 'POST user'})
    })

    router.post('/:userId/friends', async (req, res) => {
        const senderId = req.params.userId
        const friendId = req.body.friendId
        repository.addToFriends(senderId, friendId)
        res.send({data: 'POST add friend'})
    })

    router.post('/:userId/trips', async (req, res) => {
        const userId = req.params.userId
        const tripId = req.body.tripId
        repository.addToTrips(userId, tripId)
        res.send({data: 'POST add trip'})
    })

    router.post('/:userId/favourite-spots', async (req, res) => {
        const userId = req.params.userId
        const spotId = req.body.spotId
        repository.addToFavouriteSpots(userId, spotId)
        res.send({data: 'POST add favourite spot'})
    })

    router.post('/:userId/friend-requests/', async (req, res) => {
        const senderId = req.params.userId
        const friendId = req.body.friendId
        repository.addToFriendRequests(friendId, senderId)
        res.send({data: 'POST add friend request'})
    })

    // TODO: patch esetén is okés req.body-t használni?
    router.patch('/:userId/username', validate(usernameSchema), async (req, res) => {
        let userId = req.params.userId
        let newUsername = req.body.newUsername
        let result = await repository.updateUsername(userId, newUsername)
        res.send(result)
    })

    router.patch('/:userId/displayName', validate(displayNameSchema), async (req, res) => {
        let userId = req.params.userId
        let newDisplayName = req.body.newDisplayName
        let result = await repository.updateDisplayName(userId, newDisplayName)
        res.send(result)
    })

    router.delete('/:userId', async (req, res) => {
        const result = await repository.deleteUser(req.params.userId)
        res.send(result)
    })

    router.delete('/:userId/friend', async (req, res) => {
        const userId = req.params.userId
        const friendId = req.body.friendId
        repository.removeFromFriends(userId, friendId)
        res.send({data: 'DELETE remove friend'})
    })

    router.delete('/:userId/trips', async (req, res) => {
        const userId = req.params.userId
        const tripId = req.body.tripId
        repository.removeFromTrips(userId, tripId)
        res.send({data: 'DELETE remove trip'})
    })

    router.delete('/:userId/favourite-spots', async (req, res) => {
        const userId = req.params.userId
        const spotId = req.body.spotId
        repository.removeFromFavouriteSpots(userId, spotId)
        res.send({data: 'DELETE remove  favourite spot'})
    })

    router.delete('/:userId/friend-requests', async (req, res) => {
        const userId = req.params.userId
        const senderId = req.body.senderId
        repository.removeFromFriendRequests(userId, senderId)
        res.send({data: 'DELETE remove  friend request'})
    })

    return router
}

export default createUserRouter