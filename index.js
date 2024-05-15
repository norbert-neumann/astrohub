import { createApp } from './app.js'
import { connectToMongo } from './mongo-storage.js'
import { NotAuthorired } from './errorHandling.js'

const repository = await connectToMongo('mongodb+srv://neumann_norbert:projektmunka123@astrohubcluster.da8nsca.mongodb.net/?retryWrites=true&w=majority&appName=AstroHubCluster')

const userAuthMiddleware = (req, res, next) => {
    const paramUserId = req.url.split('/')[1]
    const cookieUserId = req.cookies.userId
    if (cookieUserId && cookieUserId === paramUserId) {
        next()
    } else {
        next(new NotAuthorired('Incorrect user id'))
    }
}

const dummyAutMiddleware = (req, res, next) => {
    next()
}

const app = createApp(repository, dummyAutMiddleware)

app.listen(3000, () => {
    console.log('service running on port 3000')
})