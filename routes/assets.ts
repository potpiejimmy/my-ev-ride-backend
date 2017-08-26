import { Router, Request, Response, NextFunction } from "express";
import * as Cars from "../business/cars";

const assetsRouter: Router = Router();

/**
 * getCars(user)
 */
assetsRouter.get("/", function (request: Request, response: Response, next: NextFunction) {
    Cars.getCarsForUser(request.user)
    .then(res => response.json(res))
    .catch(err => next(err));
});

/**
 * saveCar(user, car)
 */
assetsRouter.post("/", function (request: Request, response: Response, next: NextFunction) {
    Cars.saveCar(request.user, request.body)
    .then(res => response.json(res))
    .catch(err => next(err));
});

/**
 * deleteCar
 */
assetsRouter.delete("/:id", function (request: Request, response: Response, next: NextFunction) {
    Cars.deleteCar(request.user, request.params.id)
    .then(res => response.json(res))
    .catch(err => next(err));
});

export { assetsRouter }
