/* globals expect */
const s3Params = require('./s3Params');
describe('lib/assignLibsMiddleware/s3Params', () => {
  const runTest = ({req, expectedS3Params, expectedStatus, expectNext,
    expectedData}) => {
    const middleware = s3Params();
    let nextCalled = false;
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const res = {
      locals: {},
      status: s => {
        statusToSend = s;
        return {
          send: d => {sentStatus = statusToSend; sentData = d}
        }
      },
      send: d => {sentStatus = statusToSend; sentData = d}
    };
    const next = () => {nextCalled = true};
    middleware(req, res, next);
    if(expectedS3Params) {
      expect(res.locals.s3Params).toEqual(expectedS3Params);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedStatus) {
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedData) {
      expect(sentData).toEqual(expectedData);
    }
  };
  test('happy path 1', () => {
    const req = {
      body: {
        scriptPath: 'madliberation-scripts/001-Family_Script'
      }
    };
    const expectedS3Params = {
      
    };
  });
});