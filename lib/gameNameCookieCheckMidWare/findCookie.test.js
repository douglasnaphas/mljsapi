/* globals expect */
describe('gameNameCookieCheckMidWare/findCookie', () => {
  const findCookie = require('./findCookie');
  const getHash = require('../getHash');
  const responses = require('../../responses');
  const runTest = ({req, locals, expectedCookie, expectNext, expectedStatus,
    expectedData}) => {
      const middleware = findCookie();
      let statusToSend = 200;
      let sentStatus;
      let nextCalled = false;
      let sentData;
      const next = () => {nextCalled = true;};
      const res = {
        locals: locals,
        status: s => {
          statusToSend = s;
          return {
            send: d => {sentData = d; sentStatus = statusToSend;}
          }
        },
        send: d => {sentData = d; sentStatus = statusToSend;}
      }
      middleware(req, res, next);
      if(expectedCookie) {
        expect(res.locals.gameNameCookie).toEqual(expectedCookie);
      }
      if(expectNext) {
        expect(nextCalled).toBeTruthy();
      }
      if(expectedStatus) {
        expect(sentStatus).toEqual(expectedStatus);
        expect(sentData).toEqual(expectedData);
      }
    };
  test('cookie found among 4 cookies', () => {
    const roomCode = 'FOUNDA';
    const gameName = 'Cookie Monster';
    const gameNameHash = getHash(gameName);
    const locals = {
      roomCode: roomCode,
      gameName: gameName
    }
    const req = {
      cookies: {
        'wrong1num1': 'THISISWRONG1',
        'wrong1num2': 'THISISALSOWRONG',
        'wrong1num3': 'WRONG'
      }
    };
    const expectedCookie = {};
    expectedCookie[gameNameHash] = 'RIGHTRIGHTRIGHT';
    req.cookies[gameNameHash] = expectedCookie[gameNameHash];
    runTest({req: req, locals: locals, expectedCookie: expectedCookie,
      expectNext: true});
  });
});