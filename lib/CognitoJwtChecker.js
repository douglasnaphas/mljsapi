// get the JWKs and call JwtChecker
class CognitoJwtChecker {
  /**
   * @param {Function} jwkGetter A function that returns a promise that will
   * resolve to an array of JWKs for this app, or reject if none can be
   * obtained; the default is madLnJwkGetter
   */
  constructor(jwkGetter) {
    this.jwkGetter = jwkGetter || require('./madLnJwkGetter');
  }

  /**
   * Check signatures and expiration dates on JWTs, using the JWKs available for
   * this app's user pool
   * @param {String} accessJwt
   * @param {String} idJwt The JWT to check
   * @return {Promise} A promise that:
   * (1) Resolves to an object whose accessToken property is the decoded access
   * token and whose idToken property is the decoded ID token, if the provided
   * tokens are valid;
   * (2) Rejects with an error message otherwise.
   */
  checkCognitoJwt(accessJwt, idJwt) {}
}

module.exports = CognitoJwtChecker;
