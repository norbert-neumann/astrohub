import express from 'express'

function createUserRouter(repository) {
    const router = express.Router()

    router.get('/', async (req, res) => {
        let username = req.query.username
        let user = await repository.getUserByUsername(username)
        res.send(user)
    })

    router.post('/', async (req, res) => {
        res.send({data: 'POST user'})
    })

    router.put('/username', async (req, res) => {
        let currentUsername = req.query.currentUsername
        let newUsername = req.query.newUsername
        let result = await repository.updateUsername(currentUsername, newUsername)
        res.send(result)
    })

    router.delete('/', async (req, res) => {
        res.send({data: 'DELETE user'})
    })

    return router
}

export default createUserRouter