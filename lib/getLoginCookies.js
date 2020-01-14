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
  (req, res, next) => {
    return res.sendStatus(200);
  }
];
module.exports = getLoginCookies;
