const checkQueryParams = require("./checkQueryParams");
const validateQueryCode = require("./validateQueryCode");
const getLoginCookies = [
  checkQueryParams(["code"]),
  validateQueryCode,
  (req, res, next) => {
    return res.sendStatus(200);
  }
];
module.exports = getLoginCookies;
