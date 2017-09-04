var nocache = require('nocache')

import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';
import * as passport from 'passport';

import { loginRouter } from "./routes/login";
import { carsRouter } from "./routes/cars";
import { usersRouter } from "./routes/users";
import { assetsRouter } from "./routes/assets";

import * as auth from "./util/auth";

const app: express.Application = express();

app.disable('x-powered-by');

app.use(nocache());
app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));
app.use(passport.initialize());

// add CORS headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin); // XXX do not allow all origins for production
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  next();
});

// verifies the jwt for protected API routes
let verifyTokenMiddleware = auth.verifyToken();

// api routes
app.use("/myevride/api/login", loginRouter);
app.use("/myevride/api/cars", carsRouter);
app.use("/myevride/api/users", verifyTokenMiddleware, usersRouter);
app.use("/myevride/api/assets", verifyTokenMiddleware, assetsRouter);

if (app.get('env') === 'production') {

}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
  let err = new Error('Not Found');
  next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message || err
  });
});

export { app }
