const CognitoJwtChecker = require('./CognitoJwtChecker');

describe('CognitoJwtChecker', () => {
  test('mock JwtChecker should be used', () => {
    class MockJwtChecker {
      checkJwt(jot, jwks) {
        console.log('mock JwtChecker called');
        return Promise.resolve({ a: 'ay' });
      }
    }
    const cognitoJwtChecker = new CognitoJwtChecker({}, MockJwtChecker);
    cognitoJwtChecker.checkCognitoJwts('a', 'b').catch(err => {});
  });
});
