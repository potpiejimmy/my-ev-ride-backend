import * as express from 'express';
import { json, urlencoded } from 'body-parser';
import * as compression from 'compression';

import { loginRouter } from "./routes/login";
import { usersRouter } from "./routes/users";
import { carsRouter } from "./routes/cars";

import * as auth from "./util/auth";

const app: express.Application = express();

app.disable('x-powered-by');

app.use(json());
app.use(compression());
app.use(urlencoded({ extended: true }));

// verifies the jwt for protected API routes
let verifyTokenMiddleware = auth.verifyToken();

// api routes
app.use("/pt2/api/login", loginRouter);
app.use("/pt2/api/users", verifyTokenMiddleware, usersRouter);
app.use("/pt2/api/cars", verifyTokenMiddleware, carsRouter);

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

  res.status(err.status || 500);
  res.json({
    error: {},
    message: err.message || err
  });
});

export { app }
