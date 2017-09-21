import * as crypto from "crypto";
import * as auth from "../util/auth";
import * as db from "../util/db";
import * as nodeFetch from "node-fetch";
import * as FormData from 'form-data';

function callGoogleCaptchaBackend(captcha : string) : Promise<any> {
    var form = new FormData();
    form.append('secret', process.env.CAPTCHA_SECRET || '6Lc6ozEUAAAAAHYoYDzQ9gaZOHu8nj_UGHtmy2Fd');
    form.append('response', captcha);
    return nodeFetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: form })
        .then(function(res) {
            return res.json();
        }).catch(function(err) {
        console.log(err);
    });
};

export function login(username: string, password: string): Promise<any> {
    return findUser(username).then(user => {
        if (user && crypto.createHash('sha256').update(password || '').digest("hex") == user.password) {
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
        //add here google api call -> use node-fetch for post request
        return callGoogleCaptchaBackend(user.captcha).then(found => {
            if(found && found.success) {
                console.log(JSON.stringify(found));
                user.password = crypto.createHash('sha256').update(user.password).digest("hex");
                delete user.captcha;
                delete user.roles;
                return insertUser(user).then(() => readAndAuthenticate(user.name));
            } else {
                return {"result": "Sorry, I don`t think you are a real person! Please try again."}
            }
        })
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
