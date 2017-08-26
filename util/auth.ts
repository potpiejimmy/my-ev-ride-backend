import * as jwt from "jsonwebtoken";
import * as expressjwt from "express-jwt";
import * as config from '../config';

export function createToken(data:any):any {
    return jwt.sign(data, config.jwtSecret, {
            expiresIn: 60 * 60 * 24 * 30 // 30 days
    });
}

export function verifyToken() {
    return expressjwt({secret: config.jwtSecret});
}
