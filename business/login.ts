import * as crypto from "crypto";
import * as auth from "../util/auth";
import * as db from "../util/db";

export function login(user: string, password: string): Promise<any> {
    return db.querySingle("select * from user where name=?",[user]).then(res => {
        let user = res[0];
        if (user && crypto.createHash('md5').update(password).digest("hex") == user.password) {
            console.info("Login successful");
            return authenticate(user);
        } else {
            return {"result": "Sorry, wrong password."};
        }
    });        
}

export function loginCreate(username: string): Promise<any> {
    return db.querySingle("select * from user where name=?",[username]).then(res => {
        let user = res[0];
        if (user) return authenticate(user);
        user = {name: username};
        return db.querySingle("insert into user set ?", [user]).then(() => {
            return authenticate(user);
        });
    });        
}

function authenticate(user): Promise<any> {
//    return db.querySingle("select role from user_role where user_name=?", [user.name]).then(res => {
        let roles = [];
//        res.forEach(e => roles.push(e.role));
        user.roles = roles;
        let token = auth.createToken(user);
        return Promise.resolve({token:token});//return {token:token};
//    });
}
