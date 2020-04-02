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
const setDbParamsGetEmailFromSub = require("./setDbParamsGetEmailFromSub");
const runQuery = require("./runQuery");

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
    refreshAccessToken}),  // jwt_sub
  (req, res, next) => {
    console.log(`finished authenticate`);
    console.log(`res.locals.user, jwt_sub:`);
    console.log(res.locals.user);
    console.log(res.locals.jwt_sub);
    return next();
  },
  // get email addresses from dynamo where res.locals.jwt_sub is in the part key
  setDbParamsGetEmailFromSub({
    local: "jwt_sub",
    paramsName: "jwtSubEmailQueryParams"
  }),                      // jwtSubEmailQueryParams
  runQuery(
    awsSdk,
    "jwtSubEmailQueryParams",
    "jwtEmailError",
    "jwtEmailData",
    "jwtSubEmailQueryParams"
  ),                       // jwtEmailError, jwtEmailData
  // get email addresses from dynamo where res.locals.user is in the part key
  setDbParamsGetEmailFromSub({
    local: "user",
    paramsName: "userSubEmailQueryParams"
  }),                      // userSubEmailQueryParams
  runQuery(
    awsSdk,
    "userSubEmailQueryParams",
    "userEmailError",
    "userEmailData",
    "userSubEmailQueryParams"
  ),                       // userEmailError, userEmailData  
  (req, res, next) => {
    if(!res.locals.user) return next();
    console.log("authenticate: end of series (so far)");
    console.log(`jwtEmailError:`);
    console.log(res.locals.jwtEmailError);
    console.log(`jwtEmailData:`);
    console.log(res.locals.jwtEmailData);
    console.log(`userEmailError:`);
    console.log(res.locals.userEmailError);
    console.log(`userEmailData:`);
    console.log(res.locals.userEmailData);
    if(
      res.locals.jwtEmailData &&
      res.locals.jwtEmailData.Items &&
      Array.isArray(res.locals.jwtEmailData.Items) &&
      res.locals.jwtEmailData.Items.length &&
      res.locals.jwtEmailData.Items[0].user_email
    ) {
      const ar = res.locals.jwtEmailData.Items;
      for(let i = 0; i < ar.length; i++) {
        console.log(`user_email ${i}:`);
        console.log(ar[i].user_email);
      }
    }
    if(
      res.locals.userEmailData &&
      res.locals.userEmailData.Items &&
      Array.isArray(res.locals.userEmailData.Items) &&
      res.locals.userEmailData.Items.length &&
      res.locals.userEmailData.Items[0].user_email
    ) {
      const ar = res.locals.userEmailData.Items;
      for(let i = 0; i < ar.length; i++) {
        console.log(`user_email ${i}:`);
        console.log(ar[i].user_email);
      }
    }
    return next();
  }
  
  // make sure the email addresses match (probably will never be duplicates,
  // because subs (part of the part key) should be unique)
  // set the now thoroughly confirmed user email
  
  
  //////////////////////////////////////////////////////////////////////////////
  // the end goal of this whole series is to populate res.locals.userEmail    //
  // on successful authentication                                             //
  //////////////////////////////////////////////////////////////////////////////
];
module.exports = authenticate;