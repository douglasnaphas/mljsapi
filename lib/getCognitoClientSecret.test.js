const getCognitoClientSecret = require("./getCognitoClientSecret");
const responses = require("../responses");

describe("getCognitoClientSecret", () => {
  const runTest = async ({ theError, theData, expectNext, expect500 }) => {
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient: (params, cb) => {
              cb(theError, theData);
            }
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: {},
      status: jest.fn(() => ({ send })),
      sendStatus: jest.fn()
    };
    const next = jest.fn();
    await middleware(req, res, next);
    if (expectNext) {
      expect(next).toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.locals.clientSecret).toEqual(
        theData.UserPoolClient.ClientSecret
      );
      expect(send).not.toHaveBeenCalled();
      expect(status).not.toHaveBeenCalled();
      expect(res.sendStatus).not.toHaveBeenCalled();
    }
    if (expect500) {
      expect(next).not.toHaveBeenCalled();
      expect(status).toHaveBeenCalled();
      expect(status).toHaveBeenCalledTimes(1);
      expect(status).toHaveBeenCalledWith(500);
      expect(send).toHaveBeenCalled();
      expect(send).toHaveBeenCalledTimes(1);
      expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    }
  };
  test("valid data 2", () => {
    runTest({
      theError: undefined,
      theData: { UserPoolClient: { ClientSecret: "some-other-secret-3838" } },
      expectNext: true,
      expect500: false
    });
  });
  test("valid data", async () => {
    const theError = null;
    const theData = {
      UserPoolClient: {
        ClientSecret: "this-is-some-secret-xxx-yyz-113-332"
      }
    };
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient: (params, cb) => {
              cb(theError, theData);
            }
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: {},
      status: jest.fn(() => ({ send })),
      sendStatus: jest.fn()
    };
    const next = jest.fn();
    await middleware(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
    expect(res.sendStatus).not.toHaveBeenCalled();
    expect(res.locals.clientSecret).toEqual(
      "this-is-some-secret-xxx-yyz-113-332"
    );
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
  test("some error, some invalid data", async () => {
    const expectedError = "some error";
    const expectedData = "some data";
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient: (params, cb) => {
              cb(expectedError, expectedData);
            }
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: {},
      status: jest.fn(() => ({
        send
      }))
    };
    const next = jest.fn();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    expect(next).not.toHaveBeenCalled();
  });
  test("no error, no data", async () => {
    const expectedError = undefined;
    const expectedData = undefined;
    const awsSdk = {
      CognitoIdentityServiceProvider: class {
        constructor() {
          return {
            describeUserPoolClient: (params, cb) => {
              cb(expectedError, expectedData);
            }
          };
        }
      }
    };
    const middleware = getCognitoClientSecret(awsSdk);
    const req = {};
    const send = jest.fn();
    const res = {
      locals: {},
      status: jest.fn(() => ({
        send
      }))
    };
    const next = jest.fn();
    await middleware(req, res, next);
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalled();
    expect(send).toHaveBeenCalledWith(responses.SERVER_ERROR);
    expect(next).not.toHaveBeenCalled();
  });
});
