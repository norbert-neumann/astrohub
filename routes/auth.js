import express from 'express'
import bcrypt from 'bcrypt'
import googleStrategy from '../google-auth.js'
import passport from 'passport'

function createAuthRouter(repository) {
    const router = express.Router()
    
    router.get('/', async (req, res, next) => {
        if (req.cookies.userId) {
            res.render('home', {user: req.cookies.userId})
        }
        else {
            res.render('login')
        }
    })

    router.get('/register', async (req, res, next) => {
        res.render('register')
    })

    router.post('/register', async (req, res, next) => {
        console.log(' in register')
        try {
            const {username, displayName, password} = req.body
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = {
                username: req.body.username,
                displayName: req.body.displayName,
                favouriteSpots: [],
                trips: [],
                friends: [],
                friendRequests: [],
                password: hashedPassword
            }

            const result = await repository.saveUser(user)
            res.cookie('userId', result.insertedId.toString())
            res.redirect('/auth')

        } catch (error) {
            next(error)
        }
    })

    router.post('/login', async (req, res, next) => {
        try {
            const {username, password} = req.body
            const user = await repository.getUserByUsername(username)

            if (!user) {
                res.redirect('/')
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                res.cookie('userId', user._id)
            }

            res.redirect('/auth')
        }
        catch (err) {
            next(err)
        }
    })

    router.post('/logout', async (req, res, next) => {
        res.clearCookie('userId')
        res.redirect('/auth')
    })

    router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}))

    router.get('/google/callback', passport.authenticate('google', {
        session: false,
        successRedirect: '/auth',
        failureRedirect: '/auth/google/failure'
    }))

    router.get('/google/failure', (req, res) => {
        res.send('Something went wrong...')
    })

    return router
}

export default createAuthRouter