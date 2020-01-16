/**
 * @param {*} jwk2Pem Library like jwk-to-pem
 * @param {*} jwt Library like jsonwebtoken
 * @param {*} jot a JWT to check
 * @return middleware satisfying:
 *   pre:
 *     - res.locals.jwks is set to JWKs
 *
 */
const checkJwt = (jwk2Pem, jwt, jot) => {};
module.exports = checkJwt;
