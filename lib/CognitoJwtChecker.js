// get the JWKs and call JwtChecker
class CognitoJwtChecker {
  /**
   * @param {Function} getMadLnJwks A function that returns a promise that will
   * resolve to an array of JWKs for this app, or reject if none can be
   * obtained; the default is madLnJwkGetter
   */
  constructor(getMadLnJwks) {
    this.getMadLnJwks = getMadLnJwks || require('./getMadLnJwks');
  }

  /**
   * Check signatures and expiration dates on JWTs, using the JWKs available for
   * this app's user pool
   * @param {String} accessJwt
   * @param {String} idJwt The JWT to check
   * @return {Promise} A promise that:
   * (1) Resolves to an object whose userid property is the user's Cognito user
   * id, whose nickname property is the user's nickname, and whose email
   * property is the user's email address; if the provided tokens are valid;
   * (2) Rejects with an error message otherwise.
   */
  checkCognitoJwts(accessJwt, idJwt) {
    return Promise.reject('invalid JWTs');
  }
}

module.exports = CognitoJwtChecker;
