import express from 'express'
import validate from '../validator.js'
import { displayNameSchema, usernameSchema } from '../schema.js'
import createUserController from '../controllers/user.js'

function createUserRouter(repository, authMiddleware) {
    const router = express.Router()
    const controller = createUserController(repository)

    router.use(authMiddleware)

    router.get('/:userId', controller.getUser)
    router.get('/:userId/friends', controller.getFriends)
    router.get('/:userId/friend-requests', controller.getFriendRequests)
    router.get('/:userId/favourite-spots', controller.getFavouriteSpots)
    router.get('/:userId/trips', controller.getTrips)

    router.post('/:userId/friends', controller.addFriend)
    router.post('/:userId/trips', controller.addTrip)
    router.post('/:userId/favourite-spots', controller.addFavouriteSpot)
    router.post('/:userId/friend-requests/', controller.addFriendRequest)

    router.patch('/:userId/username', validate(usernameSchema), controller.updateUsername)
    router.patch('/:userId/displayName', validate(displayNameSchema), controller.updateDisplayName)

    router.delete('/:userId', controller.deleteUser)
    router.delete('/:userId/friends', controller.removeFriend)
    router.delete('/:userId/trips', controller.removeTrip)
    router.delete('/:userId/favourite-spots', controller.removeFavouriteSpot)
    router.delete('/:userId/friend-requests', controller.removeFriendRequest)

    return router
}

export default createUserRouter
