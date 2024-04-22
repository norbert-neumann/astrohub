import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
    res.send({data: 'GET user'})
})

router.post('/', async (req, res) => {
    res.send({data: 'POST user'})
})

router.put('/', async (req, res) => {
    res.send({data: 'PUT user'})
})

router.delete('/', async (req, res) => {
    res.send({data: 'DELETE user'})
})

export default router