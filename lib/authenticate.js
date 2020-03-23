const flagAuthedRequests = require("./flagAuthedRequests");
const pullTokensFromCookies = require("./pullTokensFromCookies");
const getJwksConditionally = require("./getJwksConditionally");
const authenticate = [     // saved in res.locals:
  flagAuthedRequests(),    // user (the user's email address from req.query)
  pullTokensFromCookies(), // access_token, refresh_token
  // validate access token
  (req, res, next) => {
    console.log(`authenticate: res.locals.jwks 1: ${res.locals.jwks}`);
    console.log(`authenticate: res.locals.access_token 1: ` +
      `${res.locals.access_token}`);
    console.log(`authenticate: res.locals.refresh_token 1: ` +
      `${res.locals.refresh_token}`);
    return next();
  },
  getJwksConditionally,
  (req, res, next) => {
    console.log(`authenticate: res.locals.jwks 2: ${res.locals.jwks}`);
    console.log(`authenticate: res.locals.access_token 2: ` +
      `${res.locals.access_token}`);
    console.log(`authenticate: res.locals.refresh_token 2: ` +
      `${res.locals.refresh_token}`);
    return next();
  },
  // validate access token, refreshing it if necessary (will require change to
  //   existing middleware)
];
module.exports = authenticate;