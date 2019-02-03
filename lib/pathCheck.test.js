/* globals expect */
const pathCheck = require('./pathCheck');
describe('pathCheck, middleware to ensure there is a path in the body, and ' +
  'check it against a pattern', () => {
  test('no body -> 400', () => {});
  test('no path -> 400', async () => {
    const result = await new Promise((resolve, reject) => {
      const req = {body: {nopath: 'no path'}};
      const status = (s) => {
        if(s == 400) {
          return {
            send: () => {
              resolve({sent400: true});
            }
          };
        }
      };
      const res = {
        status: status
      };
      const next = () => {
        resolve({sent400: false, nextCalled: true});
      };
      const middleware = pathCheck();
      middleware(req, res, next);
    });
    expect(result).toHaveProperty('sent400');
    expect(result.sent400).toBeTruthy();
  });
  test('body has a path that matches the regex option -> next', async () => {
    const expectedPath = 'madliberation-scripts/001-Family_Script';
    const result = await new Promise((resolve, reject) => {
      const req = {body: {path: expectedPath}};
      const status = () => {resolve({nextCalled: false})};
      const res = {
        status: status
      };
      const next = () => {
        resolve({nextCalled: true});
      };
      const options = {pathRegex: /[-a-zA-Z0-9/_]+/};
      const middleware = pathCheck(options);
      middleware(req, res, next);
    });
    expect(result).toHaveProperty('nextCalled');
    expect(result.nextCalled).toBeTruthy();
  });
});