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
            username: req.query.username,
            displayName: req.query.displayName,
            favouriteSpots: [],
            trips: [],
            friends: [],
            friendRequests: []
        }
        repository.saveUser(user)
        res.send({data: 'POST user'})
    })

    router.put('/username', async (req, res) => {
        let currentUsername = req.query.currentUsername
        let newUsername = req.query.newUsername
        let result = await repository.updateUsername(currentUsername, newUsername)
        res.send(result)
    })

    router.delete('/', async (req, res) => {
        repository.deleteUser(req.query.username)
        res.send({data: 'DELETE user'})
    })

    return router
}

export default createUserRouter