const flagAuthedRequests = require("./flagAuthedRequests");
const pullTokensFromCookies = require("./pullTokensFromCookies");
const getJwksConditionally = require("./getJwksConditionally");
const getCognitoClientSecret = require("./getCognitoClientSecret");
const awsSdk = require("aws-sdk");

const authenticate = [     // saved in res.locals:
  flagAuthedRequests(),    // user (the user's sub from req.body)
  pullTokensFromCookies(), // access_token, refresh_token
  getJwksConditionally,    // jwks
  getCognitoClientSecret(  // clientSecret
    awsSdk, "user"
  ),
  // validate access token, refreshing it if necessary (will require change to
  //   existing middleware), populate res.locals.jwt_sub
  
  // get email addresses from dynamo where res.locals.sub is the part key
  
  // get email addresses from dynamo where res.locals.jwt_sub is the part key
];
module.exports = authenticate;