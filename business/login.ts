import * as crypto from "crypto";
import * as auth from "../util/auth";
import * as db from "../util/db";

export function login(username: string, password: string): Promise<any> {
    return findUser(username).then(user => {
        if (user && crypto.createHash('md5').update(password || '').digest("hex") == user.password) {
            console.info("Login successful");
            return authenticate(user);
        } else {
            return {"result": "Sorry, wrong password."};
        }
    });        
}

export function loginCreate(user: any): Promise<any> {
    return findUser(user.name).then(found => {
        if (found) return authenticate(found);
        // insert new user
        return insertUser(user).then(() => readAndAuthenticate(user.name));
    });        
}

export function register(user: any): Promise<any> {
    return findUser(user.name).then(found => {
        if (found) return {"result": "Sorry, the user name is already in use."};
        // insert new user
        if (!user.password || user.password.length < 8) return {"result": "Sorry, bad password"};
        user.password = crypto.createHash('md5').update(user.password).digest("hex");
        delete user.roles;
        return insertUser(user).then(() => readAndAuthenticate(user.name));
    });
}

function findUser(username: string): Promise<any> {
    return db.querySingle("select * from user where name=?",[username]).then(res => res[0]);
}

function insertUser(user: any): Promise<any> {
    return db.querySingle("insert into user set ?", [user]);
}

function readAndAuthenticate(username: string): Promise<any> {
    return findUser(username).then(user => authenticate(user));
}

function authenticate(user): any {
    user.roles = user.roles.split(','); // roles as array
    delete user.password;
    let token = auth.createToken(user);
    return {token:token};
}
