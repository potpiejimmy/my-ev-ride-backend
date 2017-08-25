import { Router, Request, Response, NextFunction } from "express";
import * as config from "../config";
import * as Login from "../business/login";
import * as passport from 'passport';

const loginRouter: Router = Router();

// --- normal login via POST username and password ---

loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    Login.login(request.body.user, request.body.password)
    .then(res => response.json(res))
    .catch(err => next(err));
});

// --- Google Login ---

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: config.googleAuthClientId,
    clientSecret: config.googleAuthClientSecret,
    callbackURL: "/myevride/api/login/google/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
    Login.loginCreate(profile.emails[0].value)
        .then(token => cb(null, token))
        .catch(err => cb(err, null));
  }
));

passport.serializeUser((user, cb) => {cb(null, user);});
passport.deserializeUser((obj, cb) => {cb(null, obj);});

loginRouter.get('/google', passport.authenticate('google', { scope: ['email'] }));

loginRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.json(req.user);
});


export { loginRouter }
