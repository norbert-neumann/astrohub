import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'

const GOOGLE_CLIENT_ID = '197387661875-k862cf23lkefonm2ntfj16i1k3teb6vu.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
},
    (request, accessToken, refreshToken, profile, done) => {
        request.res.cookie('userId', profile.id)
        return done(null, profile)
    }
))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

export default passport