const validateQueryCode = require("./validateQueryCode");
describe("validateQueryCode", () => {
  const runTest = (code, expectedStatus, expectNext) => {
    const req = { query: { code } };

    const res = { status: jest.fn(), send: jest.fn(), sendStatus: jest.fn() };
    const next = jest.fn();
    const middleware = validateQueryCode(code);
    middleware(req, res, next);
    if (expectedStatus) {
      // if(res.status.mock.calls)
    }
  };
  // code is not a string
  test.each`
    code
    ${true}
  `("code=$1", ({ code }) => {
    runTest(code, 400, false);
  });
  // code has non-whitelisted characters -> 400
  test.each([["abcd-efg;a"], [";"], ["#"]])("code=%s", code => {});
});
