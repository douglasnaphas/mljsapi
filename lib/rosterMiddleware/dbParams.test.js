/* globals expect */
describe('rosterMiddleware/dbParams', () => {
  const dbParams = require('./dbParams');
  const responses = require('../../responses');
  const runTest = ({req, expect500, expectNext, expectedDbParams}) => {
    let nextCalled = false;
    let sentData;
    let statusToSend = 200;
    let sentStatus;
    const res = {
      locals: {},
      status: (s) => {
        statusToSend = s;
        return {
          send: d => { sentData = d; sentStatus = statusToSend; }
        }
      },
      send: d => { sentData = d; sentStatus = statusToSend; }
    };
    const next = () => { nextCalled = true };
    const middleware = dbParams();
    middleware(req, res, next);
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expectedDbParams) {
      expect(res.locals.dbParams).toEqual(expectedDbParams);
    }
  };
  test('should 500 on missing Room Code', () => {
    const req = {
      query: {
        gamename: 'but no room code'
      }
    };
    runTest({req: req, expect500: true});
  });
  test('should 500 on missing Game Name', () => {
    const req = {
      query: {
        roomcode: 'NOGAME'
      }
    };
    runTest({req: req, expect500: true});
  });
  
});