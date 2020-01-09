const checkQueryParams = require("./checkQueryParams");
const validateQueryCode = require("./validateQueryCode");
const getLoginCookies = [
  checkQueryParams("code"),
  validateQueryCode(req.query.code)
];
module.exports = getLoginCookies;
