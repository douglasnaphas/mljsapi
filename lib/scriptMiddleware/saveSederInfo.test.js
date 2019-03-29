/* globals expect */
describe('scriptMiddleware/saveSederInfo', () => {
  const responses = require('../../responses');
  const runTest = ({dbData, expectedPath, expectedVersion, expectedAnswers,
    expectNext, expectedStatus, expectedData}) => {
    const saveSederInfo = require('./saveSederInfo');
    const req = {};
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const res = {
      locals: {
        dbData: dbData
      },
      status: s => {
        statusToSend = s;
        return {
          send: d => {sentData = d; sentStatus = statusToSend}
        }
      },
      send: d => {sentData = d; sentStatus = statusToSend}
    };
    let nextCalled = false;
    const next = () => {nextCalled = true};
    const middleware = saveSederInfo();
    middleware(req, res, next);
    if(expectedPath) {
      expect(res.locals.path).toEqual(expectedPath);
    }
    if(expectedVersion) {
      expect(res.locals.version).toEqual(expectedVersion);
    }
    if(expectedAnswers) {
      expect(res.locals.answers).toEqual(expectedAnswers);
    }
  };
  test('no dbData', () => {
    runTest({dbData: undefined, expectedStatus: 500, expectedData: 
      responses.SERVER_ERROR});
  });
});