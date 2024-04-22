import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
    res.send({data: 'GET trip'})
})

router.post('/', async (req, res) => {
    res.send({data: 'POST trip'})
})

router.put('/', async (req, res) => {
    res.send({data: 'PUT trip'})
})

router.delete('/', async (req, res) => {
    res.send({data: 'DELETE trip'})
})

export default router