const flagAuthedRequests = require("./flagAuthedRequests");
const pullTokensFromCookies = require("./pullTokensFromCookies");
const getJwksConditionally = require("./getJwksConditionally");
const getCognitoClientSecret = require("./getCognitoClientSecret");
const awsSdk = require("aws-sdk");
const checkJwt = require("./checkJwt");
const verifyJwt = require("./verifyJwt");
const refreshAccessToken = require("./refreshAccessToken");
const jwk2Pem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");


const authenticate = [     // saved in res.locals:
  flagAuthedRequests(),    // user (the user's sub from req.body)
  ///////// below here only happens if this is an authenticated request ////////
  ///////// but middlewares have to enforce that rule individually /////////////
  pullTokensFromCookies(), // access_token, refresh_token
  getJwksConditionally,    // jwks
  getCognitoClientSecret(  // clientSecret
    awsSdk, "user"
  ),
  checkJwt({
    jwk2Pem,
    jwt,
    tokenType: "access",
    verifyJwt,
    local: "user",
    refreshAccessToken}),  // res.locals.jwt_sub
  (req, res, next) => {
    console.log(`finished authenticate`);
    console.log(`res.locals.user, jwt_sub:`);
    console.log(res.locals.user);
    console.log(res.locals.jwt_sub);
    return next();
  }
  // get email addresses from dynamo where res.locals.user is in the part key
  
  // get email addresses from dynamo where res.locals.jwt_sub is in the part key
  
  // make sure the email addresses match (probably will never be duplicates,
  // because subs (part of the part key) should be unique)
];
module.exports = authenticate;