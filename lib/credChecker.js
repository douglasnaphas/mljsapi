/**
 * Check the Authorization header or cookies for JWTs, advance with next and
 * populate req's madLnUser property if tokens are valid, send a 401 Unauthorized
 * response if no valid tokens areprovided
 * @param {Object} options Set the cognitoJwtChecker property of options to
 * use a custom implementation of CognitoJwtChecker
 * @param {Request} req Checked for either:
 * (1) an Authorization header of type Bearer and credentials equal to a
 * Cognito access token, and a query param of idtoken=ID_TOKEN_JWT; or
 * (2) cookies named idtoken and accesstoken
 * @param {Response} res 401 Unauthorized with the WWW-Authenticate header
 * set to Bearer if unauthorized
 * @param {Function} next Called if the request is authorized
 */
module.exports = function(options) {
  const cognitoJwtChecker =
    options.cognitoJwtChecker || require('./CognitoJwtChecker');
  return function(req, res, next) {
    // if there are JWTs in the Authorization header, save them in variables

    // else if there are JWTs in coookies, save them in variables

    // if there are no JWTs in variables, send 401
    res.status(401).send();

    // check saved JWTs and 401 if invalid

    next();
  };
};
