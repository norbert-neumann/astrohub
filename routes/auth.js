import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'

const GOOGLE_CLIENT_ID = '197387661875-k862cf23lkefonm2ntfj16i1k3teb6vu.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

function createAuthRouter(repository) {
    const router = express.Router()
    
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true
    },
        async (request, accessToken, refreshToken, profile, done) => {
    
            const userId = '000' + profile.id
            const user = {
                _id: userId,
                username: profile.email,
                displayName: profile.given_name,
                favouriteSpots: [],
                trips: [],
                friends: [],
                friendRequests: []
            }

            await repository.getOrCreate(user)
    
            request.res.cookie('userId', userId)
            return done(null, profile)
        }
    ))
    
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

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