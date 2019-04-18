/* globals expect */
describe('joinSederMiddleware/succeed', () => {
  const succeed = require('./succeed');
  const responses = require('../../responses');
  const runTest = async ({req, expect500, expectedData}) => {
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const res = {};
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (d) => {sentStatus = statusToSend; sentData = d;}
      }
    };
    res.send = (d) => {sentStatus = statusToSend; sentData = d;};
    const middleware = succeed();
    await middleware(req, res);
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
    if(expectedData) {
      expect(sentStatus).toEqual(200);
      expect(sentData).toEqual(expectedData);
    }
  };
  test('expect 500 on missing gameName', () => {
    const req = {
      body: {
        roomCode: 'JUSTCO'
      }
    };
    runTest({req: req, expect500: true});
  });
  test('expect 500 on missing roomCode', () => {
    const req = {
      body: {
        gameName: 'JUSTCO'
      }
    };
    runTest({req: req, expect500: true});
  });
  test('roomCode, gameName should be returned on success', async () => {
    const req = {
      body: {
        gameName: 'my name',
        roomCode: 'MYCODE'
      }
    };
    const expectedData = {
      result: 'success',
      gameName: 'my name',
      roomCode: 'MYCODE'
    };
    await runTest({req: req, expectedData: expectedData});
  });
});