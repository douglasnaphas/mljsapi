/* globals expect, jest */
describe('checkJwt', () => {
  const checkJwt = require("./checkJwt");
  test("checkJwt({local: 'x'}) means next() if(!res.locals.x)", () => {
    const req = {};
    const res = {locals: {}}; // res.locals.x is undefined
    const next = jest.fn();
    const local = "x";
    const middleware = checkJwt({local});
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("checkJwt({local: 'user'}) means next() if(!res.locals.user)", () => {
    const req = {};
    const res = {locals: {x: 'y'}}; // res.locals.x is undefined
    const next = jest.fn();
    const local = "user";
    const middleware = checkJwt({local});
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("checkJwt({local: 'user'}) means the middleware should proceed "+
    "if(res.locals.user)", () => {
    const req = {};
    const sendStatus = jest.fn();
    const res = {
      locals: {user: "no-jwt-cookies-like-access_token"},
      sendStatus
    };
    const next = jest.fn();
    const local = "user";
    const middleware = checkJwt({local, tokenType: "access"});
    middleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
  test("should check unexpired access token", () => {
    
  });
  test("should refresh access token, new access token valid", () => {});
  test("refresh access token, new access token invalid (rare case)", () => {});
});