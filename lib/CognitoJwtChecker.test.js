const CognitoJwtChecker = require('./CognitoJwtChecker');

describe('CognitoJwtChecker', () => {
  test.skip('checkJwt should be called', async () => {
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
  test.skip('trying to call rejection path', async () => {
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
  test('trying to call rejection path 2', async () => {
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

    await cognitoJwtChecker.checkCognitoJwts(accessJwt, idJwt);
    console.log('idJwt.resolved: ' + idJwt.resolved);
    expect(true).toBeTruthy();
  });
  test('...', () => {});
});
