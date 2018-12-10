const CognitoJwtChecker = require('./CognitoJwtChecker');

describe('CognitoJwtChecker', () => {
  test('checkJwt should be called', async () => {
    class MockJwtChecker {
      checkJwt(jot, jwks) {
        // return Promise.resolve({ mockCalled: true });
        return Promise.reject({ mockCalled: true });
      }
    }
    const cognitoJwtChecker = new CognitoJwtChecker(false, MockJwtChecker);
    let result = 'nothing';
    const accessJwt = { a1: 'ay 1' };
    const idJwt = { i1: 'eye 1' };

    try {
      result = await cognitoJwtChecker.checkCognitoJwts(accessJwt, idJwt);
    } catch (e) {
      console.log('rejected with: ' + e);
    }
    console.log('result: ' + result);
    console.log('idJwt.resolved: ' + idJwt.resolved);
  });
  test('trying to call rejection path', async () => {
    class MockJwtChecker {
      checkJwt(jot, jwks) {
        // return Promise.resolve({ mockCalled: true });
        return Promise.reject(() => {
          console.log('within rejection');
          expect(true).toBeTruthy();
        });
      }
    }
    const cognitoJwtChecker = new CognitoJwtChecker(false, MockJwtChecker);
    let result = 'nothing';
    const accessJwt = { a1: 'ay 1' };
    const idJwt = { i1: 'eye 1' };

    expect.assertions(1);
    try {
      result = await cognitoJwtChecker.checkCognitoJwts(accessJwt, idJwt);
    } catch (e) {
      console.log('rejected with: ' + e);
    }
    console.log('result: ' + result);
    console.log('idJwt.resolved: ' + idJwt.resolved);
  });
  test.only('trying to call rejection path 2', () => {
    class MockJwtChecker {
      checkJwt(jot, jwks) {
        // return Promise.resolve({ mockCalled: true });
        return Promise.reject(() => {
          console.log('within rejection');
          // expect(true).toBeTruthy();
        });
      }
    }
    const cognitoJwtChecker = new CognitoJwtChecker(false, MockJwtChecker);
    let result = 'nothing';
    const accessJwt = { a1: 'ay 1' };
    const idJwt = { i1: 'eye 1' };

    expect.assertions(1);
    // try {
    cognitoJwtChecker.checkCognitoJwts(accessJwt, idJwt);
    // } catch (e) {
    return Promise.resolve({ accessJwt: accessJwt, idJwt: idJwt }).then(r => {
      console.log('idJwt.resolved: ' + idJwt.resolved);
      expect(true).toBeTruthy();
    });
  });
});
