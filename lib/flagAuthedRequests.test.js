/* globals expect, jest */
describe('lib/flagAuthedRequests', () => {
  const flagAuthedRequests = require('./flagAuthedRequests');
  test('no user param, expect next', () => {
    const req = {query: {}};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn()}
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  })
});