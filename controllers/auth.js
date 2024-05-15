import bcrypt from 'bcrypt'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'

function createAuthController(userRepository) {
    const googleStrategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true
    }, async (request, accessToken, refreshToken, profile, done) => {
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

        await userRepository.getOrCreate(user)
        request.res.cookie('userId', userId)
        return done(null, profile)
    })

    const serializeUser = (user, done) => done(null, user)
    const deserializeUser = (user, done) => done(null, user)

    const renderHomeOrLogin = async (req, res, next) => {
        if (req.cookies.userId) {
            res.render('home', {user: req.cookies.userId})
        } else {
            res.render('login')
        }
    }

    const renderRegisterForm = async (req, res, next) => {
        res.render('register')
    }

    const registerUser = async (req, res, next) => {
        try {
            const {username, displayName, password} = req.body
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = {
                username,
                displayName,
                favouriteSpots: [],
                trips: [],
                friends: [],
                friendRequests: [],
                password: hashedPassword
            }

            const result = await userRepository.saveUser(user)
            res.cookie('userId', result.insertedId.toString())
            return res.redirect('/auth')
        } catch (error) {
            next(error)
        }
    }

    const loginUser = async (req, res, next) => {
        try {
            const {username, password} = req.body
            const user = await userRepository.getUserByUsername(username)

            if (!user) {
                return res.redirect('/auth')
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                res.cookie('userId', user._id)
            }

            return res.redirect('/auth')
        } catch (err) {
            next(err)
        }
    }

    const logoutUser = async (req, res, next) => {
        res.clearCookie('userId')
        return res.redirect('/auth')
    }

    const renderGoogleFailure = (req, res) => {
        res.send('Something went wrong...')
    }

    return {
        googleStrategy,
        serializeUser,
        deserializeUser,
        renderHomeOrLogin,
        renderRegisterForm,
        registerUser,
        loginUser,
        logoutUser,
        renderGoogleFailure
    }
}

export default createAuthController
