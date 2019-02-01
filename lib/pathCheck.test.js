/* globals expect */
const pathCheck = require('./pathCheck');
describe('pathCheck, middleware to ensure there is a path in the body, and ' +
  'check it against a pattern', () => {
  test('no body -> 400', () => {});
  test('no path -> 400', () => {
    const req = {body: {nopath: 'no path'}};
    let status400 = false;
    let sent400 = false;
    let nextCalled = false;
    const res = {
      status: (s) => {
        if(s == 400) {
          status400 = true;
          return {send: sent400 = true}
        }
      }
    };
    const next = () => {nextCalled = true};
  });
});