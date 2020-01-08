const checkQueryParams = require("./checkQueryParams");
const getLoginCookies = [checkQueryParams("code")];
module.exports = getLoginCookies;
