/* globals expect */
const s3Params = require('./s3Params');
const bucket = require('../../bucket');
const responses = require('../../responses');
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
      expect(res.locals.assignLibsS3Params).toEqual(expectedS3Params);
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
      Bucket: bucket.Bucket,
      Key: bucket.path2key(req.body.scriptPath)
    };
    runTest({req: req, expectNext: true, expectedS3Params: expectedS3Params});
  });
  test('happy path 2', () => {
    const req = {
      body: {
        scriptPath: 'madliberation-scripts/002-Dirty_Script'
      }
    };
    const expectedS3Params = {
      Bucket: bucket.Bucket,
      Key: bucket.path2key(req.body.scriptPath)
    };
    runTest({req: req, expectNext: true, expectedS3Params: expectedS3Params});
  });
  test('missing path', () => {
    const req = {
      body: {}
    };
    runTest({req: req, expectedStatus: 400,
      expectedData: responses.BAD_REQUEST});
  });
});