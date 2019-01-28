export const serverPort = 4300;
//API ORIGIN FOR 3RD PARTY LOGINS
export const apiOrigin = (process.env.API_ORIGIN ? process.env.API_ORIGIN : '') + "/myevride/api/login/google/callback";
//GOOGLE LOGIN API
export const googleAuthClientId = process.env.GOOGLE_AUTH_CLIENT_ID || '503544898754-3bq5hp1t11k56rum5vuc10equ82ir7ps.apps.googleusercontent.com';
export const googleAuthClientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET || 'XRo0sU6sH5ddCZYbRNWhLo7-';
//FACEBOOK LOGIN API
export const facebookAppId = process.env.FACEBOOK_APP_ID || '1686521481419336';
export const facebookAppSecret = process.env.FACEBOOK_APP_SECRET || '6416a85986623904282bb8bad086cda2';
//JWT SECRET
export const jwtSecret = process.env.JWT_SECRET || 'supersecret';
//DB CREDENTIALS
export const dbHost = process.env.DB_HOST || 'localhost';
export const dbSchema = process.env.DB_SCHEMA || 'myevride';
export const dbUser = process.env.DB_USER || 'myevride';
export const dbPassword = process.env.DB_PASSWORD || 'myevride';
//RECAPTCHA KEY
export const captchaSecret = process.env.CAPTCHA_SECRET || '6Lc6ozEUAAAAAHYoYDzQ9gaZOHu8nj_UGHtmy2Fd';

