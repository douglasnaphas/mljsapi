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
  (req, res, next) => {
    return res.status(200).send({ data: "success" });
  }
];
module.exports = getLoginCookies;
