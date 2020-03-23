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
    const req = {body: {user: 'afjda0-943fakd8-fajsdk23-ffasdf3'}};
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
    const req = {body: {user: 'fjsadkl-4324-fa3erewio'}};
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
    const req = {body: {user: 'even odd subs are accepted, they just have to' +
      ' be strings'
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