const getCognitoClientSecret = require("./getCognitoClientSecret");
const responses = require("../responses");

describe("getCognitoClientSecret", () => {
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
