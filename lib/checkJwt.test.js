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
  test("should check unexpired access token", () => {
    
  });
  test("should refresh access token, new access token valid", () => {});
  test("refresh access token, new access token invalid (rare case)", () => {});
});