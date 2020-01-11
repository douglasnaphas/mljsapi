const checkQueryParams = require("./checkQueryParams");
const validateQueryCode = require("./validateQueryCode");
const exchangeCodeForTokens = require("./exchangeCodeForTokens");
const getLoginCookies = [
  checkQueryParams(["code"]),
  validateQueryCode,
  exchangeCodeForTokens(),
  (req, res, next) => {
    return res.sendStatus(200);
  }
];
module.exports = getLoginCookies;
