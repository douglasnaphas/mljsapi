/* globals expect */
const sanitizeGameName = require('./sanitizeGameName');
describe('sanitizeGameName', () => {
  const runTest = async ({illegalCharacters, inputGameName,
    expectedSanitizedGameName, expectNext}) => {
      const middleware = sanitizeGameName(illegalCharacters);
      const req = {
        body: {
          gameName: inputGameName
        }
      };
      let nextCalled = false;
      const next = () => {
        nextCalled = true;
      };
      const result = await middleware(req, {}, next);
      if(expectedSanitizedGameName) {
        expect(req.body.gameName).toEqual(expectedSanitizedGameName);
      }
      expect(nextCalled).toEqual(expectNext);
    };
  test('should return middleware', () => {
    const middleware = sanitizeGameName([]);
    middleware();
  });
  test('game name with no illegal characters should be unchanged', () => {
    return runTest({illegalCharacters: [], inputGameName: 'Nothing Bad',
      expectedSanitizeGameName: 'Nothing Bad', expectNext: true});
  });
});