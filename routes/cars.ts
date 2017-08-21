import { Router, Request, Response, NextFunction } from "express";
import * as Bookings from "../business/cars";

const carsRouter: Router = Router();

/**
 * getBookings(day?)
 */
carsRouter.get("/", function (request: any, response: Response, next: NextFunction) {
    Bookings.getBookings(request.user, request.query.day ? parseInt(request.query.day) : Date.now())
    .then(res => response.json(res))
    .catch(err => next(err));
});

export { carsRouter }
