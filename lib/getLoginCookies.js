const checkQueryParams = require("./checkQueryParams");
const validateQueryCode = require("./validateQueryCode");
const getCognitoClientSecret = require("./getCognitoClientSecret");
const exchangeCodeForTokens = require("./exchangeCodeForTokens");
const awsSdk = require("aws-sdk");
const axios = require("axios");

const getLoginCookies = [
  checkQueryParams(["code"]),
  validateQueryCode,
  getCognitoClientSecret(awsSdk),
  exchangeCodeForTokens(axios),
  // get JWKs from public URL
  // validate JWTs
  // set the cookies
  // figure out the user
  // set nickname response param
  // figure out the redirect URI host
  // set the redirect URI
  (req, res, next) => {
    return res.redirect("http://localhost:3000/?user=x");
  }
];
module.exports = getLoginCookies;
