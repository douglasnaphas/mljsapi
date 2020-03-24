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
    expect(sendStatus).toHaveBeenCalled();
    expect(sendStatus).toHaveBeenCalledWith(500);
  });
  test('no jwks in locals, should fail', () => {});
  test.only("should check unexpired access token", () => {
    const req = {};
    const sendStatus = jest.fn();
    const send = jest.fn();
    const status = jest.fn(() => {send});
    const access_token = "43890jfasjkJIEfa.290fdjanIFDJ23AVDS.823jfalvmfHHH==";
    const jwks = [{kid: 'incorrect kid'}, {kid: 'correct kid'}];
    const res = {
      sendStatus,
      status,
      send,
      locals: {
        access_token,
        jwks
      }
    };
    const tokenType = "access";
    const decodedJot = {
      header: {
        kid: 'correct kid'
      },
      payload: {},
      signature: {}
    };
    const jwkPem = {};
    const jwk2Pem = jest.fn((jwk) => {
      if(jwk.kid === 'correct kid') {
        return jwkPem;
      }
    });
    const jwt = {
      decode: jest.fn((jot, options) => {
        if(jot === access_token && options && options.complete) {
          return decodedJot;
        }
      }),
      verify: jest.fn((token, secretOrPublicKey, options) => {
        if(token !== access_token || secretOrPublicKey !== jwkPem ||
          !options || options.algorithm !== "RS256") {
            throw "mock verification failed";
          }
      })
    };
    const next = jest.fn();
    const middleware = checkJwt({
      jwk2Pem,
      jwt,
      tokenType: "access"
    });
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  test("should refresh access token, new access token valid", () => {});
  test("refresh access token, new access token invalid (rare case)", () => {});
});