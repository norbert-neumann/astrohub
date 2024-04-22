import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
    res.send({data: 'GET spot'})
})

router.post('/', async (req, res) => {
    res.send({data: 'POST spot'})
})

router.put('/', async (req, res) => {
    res.send({data: 'PUT spot'})
})

router.delete('/', async (req, res) => {
    res.send({data: 'DELETE spot'})
})

export default router