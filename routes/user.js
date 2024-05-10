import express from 'express'
import validate from '../validator.js'
import { displayNameSchema, userSchema, usernameSchema } from '../schema.js'
import createUserController from '../controllers/user.js'

function createUserRouter(repository) {
    const router = express.Router()
    const controller = createUserController(repository)

    const extractUserId = (req, res, next) => {
        const userId = req.cookies.userId
        if (userId) {
            req.params.userId = userId
            next()
        } else {
            res.sendStatus(401)
        }
    }

    router.use((req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/') {
            extractUserId(req, res, next)
        } else {
            next()
        }
    })

    router.get('/:userId', controller.getUser)
    router.get('/:userId/friends', controller.getFriends)
    router.get('/:userId/friend-requests', controller.getFriendRequests)
    router.get('/:userId/favourite-spots', controller.getFavouriteSpots)
    router.get('/:userId/trips', controller.getTrips)

    router.post('/', validate(userSchema), controller.createUser)
    router.post('/:userId/friends', controller.addFriend)
    router.post('/:userId/trips', controller.addTrip)
    router.post('/:userId/favourite-spots', controller.addFavouriteSpot)
    router.post('/:userId/friend-requests/', controller.addFriendRequest)

    router.patch('/:userId/username', validate(usernameSchema), controller.updateUsername)
    router.patch('/:userId/displayName', validate(displayNameSchema), controller.updateDisplayName)

    router.delete('/:userId', controller.deleteUser)
    router.delete('/:userId/friend', controller.removeFriend)
    router.delete('/:userId/trips', controller.removeTrip)
    router.delete('/:userId/favourite-spots', controller.removeFavouriteSpot)
    router.delete('/:userId/friend-requests', controller.removeFriendRequest)

    return router
}

export default createUserRouter
