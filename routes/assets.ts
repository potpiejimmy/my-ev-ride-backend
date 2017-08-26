import { Router, Request, Response, NextFunction } from "express";
import * as Cars from "../business/cars";

const assetsRouter: Router = Router();

/**
 * saveCar(user, car)
 */
assetsRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    Cars.saveCar(request.user, request.body)
    .then(res => response.json(res))
    .catch(err => next(err));
});

export { assetsRouter }
