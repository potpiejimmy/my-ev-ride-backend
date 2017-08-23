import { Router, Request, Response, NextFunction } from "express";
import * as Cars from "../business/cars";

const carsRouter: Router = Router();

/**
 * getCars()
 */
carsRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
    Cars.getCars()
    .then(res => response.json(res))
    .catch(err => next(err));
});

export { carsRouter }
