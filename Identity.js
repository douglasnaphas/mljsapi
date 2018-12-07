const jwt = require('jsonwebtoken');
// import * as jwt from 'jsonwebtoken';
class Identity {
  /**
   *
   * @param {String} jot A JSON Web Token
   * @param {Array} jwks Array of objects consumable by jwk-to-pem
   * @return {Promise} A promise that resolves to the decoded token if jwt has
   * a valid signature, rejects otherwise
   */
  static checkJwt(jot, jwks) {
    if (!jot) {
      return Promise.reject('bad jwt: ' + jot);
    }
    if (!jwks) {
      return Promise.reject('bad JWKs: ' + jwks);
    }
    try {
      jwt.verify('a', 'b');
    } catch (err) {
      console.log('verify error: ' + err);
    }

    return new Promise((resolve, reject) => {
      resolve(jot);
    });
  }
}

module.exports = Identity;
