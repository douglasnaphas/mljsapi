const checkQueryParams = require("./checkQueryParams");
const validateQueryCode = require("./validateQueryCode");
const getCognitoClientSecret = require("./getCognitoClientSecret");
const exchangeCodeForTokens = require("./exchangeCodeForTokens");
const awsSdk = require("aws-sdk");
const axios = require("axios");
const getMadLnJwksFromAws = require("./getMadLnJwksFromAws");
const jwk2Pem = require("jwk-to-pem");
const checkJwt = require("./checkJwt");
const jwt = require("jsonwebtoken");
const setJwtCookies = require("./setJwtCookies");

const getLoginCookies = [
  checkQueryParams(["code"]),
  validateQueryCode,
  getCognitoClientSecret(awsSdk),
  exchangeCodeForTokens(axios),
  getMadLnJwksFromAws(axios),
  checkJwt({ jwk2Pem, jwt, tokenType: "id" }),
  setJwtCookies(),
  // figure out the user

  // set nickname and email response params
  // figure out the redirect URI host
  // set the redirect URI
  (req, res, next) => {
    return res.redirect("http://localhost:3000/?user=x");
  }
];
module.exports = getLoginCookies;
