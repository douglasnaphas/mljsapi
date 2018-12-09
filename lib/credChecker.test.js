const credChecker = require('./credChecker');

describe('credChecker, authorization middleware', () => {
  test('no JWTs, should get 401', () => {
    const req = {
      header: () => {
        return '';
      }
    };
  });
});
