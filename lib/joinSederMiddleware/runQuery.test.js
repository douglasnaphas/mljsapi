/* globals expect */
describe('joinSederMiddleware/runQuery', () => {
  const runQuery = require('./runQuery');
  const runTest = async ({awsSdk, req, expectNext, expect400, expect500,
    expectedError, expectedData}) => {
    const middleware = runQuery(awsSdk);
    const result = await new Promise((resolve, reject) => {
      
    });
  };
  test('...', () => {});
});