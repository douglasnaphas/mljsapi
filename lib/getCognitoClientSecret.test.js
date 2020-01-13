const getCognitoClientSecret = require("./getCognitoClientSecret");

describe("getCognitoClientSecret", () => {
  test("...", async () => {
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
    const res = {
      status: () => {
        return {
          send: jest.fn()
        };
      }
    };
    const next = jest.fn();
    await middleware(req, res, next);
  });
});
