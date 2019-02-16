/* globals expect */
describe('checkBody', () => {
  const checkBody = require('./checkBody');
  const runTest = ({expectedBodyParams, req, expect400, expectNext}) => {
    let statusToSend = 200;
    let sentStatus;
    let nextCalled = false;
    let sentData;
    const middleware = checkBody(expectedBodyParams);
    const res = {
      status: (s) => {
        statusToSend = s;
        return {
          send: (d) => {
            sentStatus = statusToSend;
            sentData = d;
          }
        }
      },
      send: () => {
        sentStatus = statusToSend;
      }
    };
    const next = () => {
      nextCalled = true;
    };
    middleware(req, res, next);
    if (expect400) {
      expect(sentStatus).toEqual(400);
    }
    if (expectNext) {
      expect(nextCalled).toBeTruthy();
    }
  };
  test('all requested body params -> next', () => {
    const expectedBodyParams = ['roomCode', 'gameName'];
    const req = {
      body: {
        roomCode: 'ABCEEE',
        gameName: 'some name'
      }
    };
    runTest({expectedBodyParams: expectedBodyParams, req: req,
      expectNext: true});
  });
  test('missing body param -> 400', () => {
    const expectedBodyParams = ['data1', 'data2'];
    const req = {
      body: {
        data1: 'some data',
        data3: 'missing data2'
      }
    }
    runTest({expectedBodyParams: expectedBodyParams, req: req,
      expect400: true});
  });
  test('no body in req -> 400', () => {
    const expectedBodyParams = ['something'];
    const req = {
      nobody: 'nothing'
    };
    runTest({expectedBodyParams: expectedBodyParams, req: req,
      expect400: true});
  });
});