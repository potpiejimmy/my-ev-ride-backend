import * as crypto from "crypto";
import * as auth from "../util/auth";
import * as db from "../util/db";

export function login(user: string, password: string): Promise<any> {
    return db.querySingle("select * from user where name=?",[user]).then(res => {
        let user = res[0];
        if (user && crypto.createHash('md5').update(password || '').digest("hex") == user.password) {
            console.info("Login successful");
            return authenticate(user);
        } else {
            return {"result": "Sorry, wrong password."};
        }
    });        
}

export function loginCreate(user: any): Promise<any> {
    return db.querySingle("select * from user where name=?",[user.name]).then(res => {
        let found = res[0];
        if (found) return authenticate(found);
        // insert new user
        return db.querySingle("insert into user set ?", [user]).then(() => {
            return authenticate(user);
        });
    });        
}

function authenticate(user): any {
    user.roles = user.roles.split(','); // roles as array
    delete user.password;
    let token = auth.createToken(user);
    return {token:token};
}
