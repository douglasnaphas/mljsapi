/* globals expect, jest */
describe('lib/flagAuthedRequests', () => {
  const flagAuthedRequests = require('./flagAuthedRequests');
  const responses = require('../responses');
  test('no user param, expect next', () => {
    const req = {query: {}};
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
  test('user too short, expect 400', () => {
    const req = {query: {user: 'a@b.'}};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn(() => ({send}))};
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(responses.BAD_REQUEST);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.locals.user).toBeUndefined();
  });
  test('email provided 1', () => {
    const req = {query: {user: 'a@b.com'}};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn(() => ({send}))};
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toEqual(req.query.user);
  });
  test('email provided 2', () => {
    const req = {query: {user: 'doug@passover.lol'}};
    const send = jest.fn();
    const res = {locals: {}, status: jest.fn(() => ({send}))};
    const next = jest.fn();
    const middleware = flagAuthedRequests();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toEqual(req.query.user);
  });
});