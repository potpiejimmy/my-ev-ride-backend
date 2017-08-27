import { Router, Request, Response, NextFunction } from "express";
import * as config from "../config";
import * as Login from "../business/login";
import * as passport from 'passport';
import * as session from 'express-session'; // only needed for Google/FB login process

const loginRouter: Router = Router();

// session only needed for google/FB login.
// keep the session-less JWT for 3 minutes in session memory to be obtained via GET /login API call
loginRouter.use(session({
    name: 'my-ev-ride-log-in',
    secret: 'temporary',
    unset: 'destroy',
    resave: false,
    saveUninitialized: false,
    cookie: { path: '/', httpOnly: false, secure: false/* XXX true for prod*/, maxAge: 180000 }
})); 

/*
 * Sign in using user name and password
 */
loginRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    Login.login(request.body.user, request.body.password)
    .then(res => response.json(res))
    .catch(err => next(err));
});

/**
 * Sign in by returnig pre-authenticated session jwt (Google and Facebook login)
 */
loginRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
    let jwt = request.session.jwt;
//    delete request.session;
    response.json(jwt);
});

// --- login with Google ---
loginRouter.get('/google',
    (req,res,next) => {
        req.session.returnurl = req.query.returnurl;
        next();
    },
    passport.authenticate('google', { scope: ['email'] })
);

// --- login with Google callback ---
loginRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // create user from google profile information
    Login.loginCreate(req.user)
        .then(token => {
            // store token temporarily in session
            req.session.jwt = token;
            res.redirect(req.session.returnurl);
        })
        .catch(err => res.json(err));
});

// --- Setup Passport.js ---

passport.serializeUser((user, cb) => {cb(null, user);});
passport.deserializeUser((obj, cb) => {cb(null, obj);});

// --- Passport: Google Login ---

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: config.googleAuthClientId,
    clientSecret: config.googleAuthClientSecret,
    callbackURL: (process.env.API_ORIGIN ? process.env.API_ORIGIN : '') + "/myevride/api/login/google/callback"
  }, (accessToken, refreshToken, profile, cb) => {
      console.log(JSON.stringify(profile));
      let user = {
          name: profile.emails[0].value,
          email: profile.emails[0].value,
          display_name: profile.displayName
      }
      return cb(null, user);
  }
));

// ---

export { loginRouter }
