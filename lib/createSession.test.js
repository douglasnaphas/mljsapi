/* globals expect */
const createSession = require('./createSession');

describe('createSession', () => {
  
  
  const runTest = async ({req, expectedStatus, expectedResponseData, expectNext,
    dbFail}) => {
    let participantInDbCall;
    let sessionKeyInDbCall;
    const db =  {
      update: (params, cb) => {
        if(dbFail ||
          !params ||
          !params.ExpressionAttributeNames ||
          !params.ExpressionAttributeNames['#P'] ||
          params.ExpressionAttributeNames['#P'] != 'participant' ||
          !params.ExpressionAttributeNames['#S'] ||
          params.ExpressionAttributeNames['#S'] != 'session_key' ||
          !params.ExpressionAttributeValues ||
          !params.ExpressionAttributeValues[':p'] ||
          !params.ExpressionAttributeValues[':s'] ||
          !params.Key ||
          !params.Key.room_code ||
          params.Key.room_code != req.body.roomCode ||
          !params.Key.lib_id ||
          params.Key.lib_id != 'participant' ||
          !params.TableName ||
          params.TableName != 'seders' ||
          !params.UpdateExpression ||
          params.UpdateExpression != 'SET #P = :p, #S = :s'){
          cb({err: 'there was an error'}, false);
        } else {
          participantInDbCall = params.ExpressionAttributeValues[':p'];
          sessionKeyInDbCall = params.ExpressionAttributeValues[':s'];
          cb(false, {success: true});
        }
      }
    };
    const awsSdk = {
      DynamoDB: {
        DocumentClient: class {
          constructor() {
            return db;
          }
        }
      }
    };
    const middleware = createSession(awsSdk);
    let nextCalled = false;
    let sendCalled = false;
    let sentStatus = 200;
    let sentData;
    const result = await new Promise((resolve, reject) => {
      const res = {
        status: (s) => {
          sentStatus = s;
          return {
            send: (data) => {
              sendCalled = true;
              resolve({sentStatus: s, sentData: data});
            }
          }
        },
        send: (data) => {
          sendCalled = true;
          resolve({sentStatus: sentStatus, sentData: data});
        }
      };
      const next = () => {nextCalled = true; resolve();};
      middleware(req, res, next);
    });
    if(expectedStatus) {
      expect(sendCalled).toBeTruthy();
      expect(sentStatus).toEqual(expectedStatus);
    }
    if(expectedResponseData) {
      expect(sendCalled).toBeTruthy();
      expect(sentData).toEqual(expectedResponseData);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    // update should have been called with the right session key info
    expect(participantInDbCall).toEqual(req.body.gameName);
    expect(sessionKeyInDbCall).toEqual(req.cookies[req.body.gameName]);
  };
  
  // happy path objects
  const happyPathRoomCode = 'HAPPYP';
  const happyPathGameName = 'I Am Happy';
  const happyPathBody = {
    roomCode: happyPathRoomCode,
    gameName: happyPathGameName
  };
  const happyPathCookies = {};
  happyPathCookies[happyPathGameName] = 'SESSIONKEY';
  const happyPathReq = {
    body: {
      roomCode: happyPathRoomCode,
      gameName: happyPathGameName
    },
    cookies: happyPathCookies
  };
  
  test('happy path', () => {
    // {req, expectedStatus, expectedResponseData, expectNext,
    // dbFail}
    return runTest({req: happyPathReq, expectNext: true});
  });
  test('db fails -> 500', () => {});
  test('no room code in request -> 400', () => {});
  test('no game name in request -> 400', () => {});
  test('no cookie -> 400', () => {});
  test('cookie has no key for game name -> 400', () => {});
});