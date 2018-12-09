/**
 * Check the Authorization header or cookies for JWTs, advance with next if
 * tokens are valid, send a 401 Unauthorized response if no valid tokens are
 * provided
 * @param {Request} req Checked for an Authorization header of type Bearer and
 * with idtoken=ID_TOKEN_JWT,accesstoken=ACCESS_TOKEN_JWT, or for cookies named
 * idtoken and adcesstoken
 * @param {Response} res 401 Unauthorized with the WWW-Authenticate header
 * set to Bearer if unauthorized
 * @param {Function} next Called if the request is authorized
 */
module.exports = function(req, res, next) {
  // if there are JWTs in the Authorization header, save them in variables

  // else if there are JWTs in coookies, save them in variables

  // if there are no JWTs in variables, send 401

  // check saved JWTs and 401 if invalid

  next();
};
