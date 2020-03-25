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
  //   existing middleware)
  
];
module.exports = authenticate;