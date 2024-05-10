import express from 'express'
import passport from 'passport'
import validate from '../validator.js'
import { registerUserSchema } from '../schema.js'
import createAuthController from '../controllers/auth.js'

function createAuthRouter(repository) {
    const router = express.Router()
    const controller = createAuthController(repository)
    
    passport.use(controller.googleStrategy)
    passport.serializeUser(controller.serializeUser)
    passport.deserializeUser(controller.deserializeUser)

    router.get('/', controller.renderHomeOrLogin)
    router.get('/register', controller.renderRegisterForm)

    router.get('/google', passport.authenticate('google', {
        scope: ['email', 'profile']
    }))

    router.get('/google/callback', passport.authenticate('google', {
        session: false,
        successRedirect: '/auth',
        failureRedirect: '/auth/google/failure'
    }))
    
    router.get('/google/failure', controller.renderGoogleFailure)

    router.post('/register', validate(registerUserSchema), controller.registerUser)
    router.post('/login', controller.loginUser)
    router.post('/logout', controller.logoutUser)

    return router
}

export default createAuthRouter
