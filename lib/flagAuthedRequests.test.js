/* globals expect, jest */
describe('lib/flagAuthedRequests', () => {
  const flagAuthedRequests = require('./flagAuthedRequests');
  const responses = require('../responses');
  test('no user param, expect next', () => {
    const req = {body: {}};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn(() => ({send}))};
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toBeUndefined();
  });
  test('email provided 1', () => {
    const req = {body: {user: 'a@b.com'}};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn(() => ({send}))};
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toEqual(req.body.user);
  });
  test('email provided 2', () => {
    const req = {body: {user: 'doug@passover.lol'}};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn(() => ({send}))};
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toEqual(req.body.user);
  });
  test('bad email provided, should be accepted here', () => {
    const req = {body: {user: 'even bad emails are accepted, because we ' +
      'can reasonably assume they will not match what is in the access_token'
    }};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn(() => ({send}))};
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toEqual(req.body.user);
  });
});