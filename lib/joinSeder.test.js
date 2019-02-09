/* globals expect */
const joinSeder = require('./joinSeder');

describe('joinSeder', () => {
  const goodCode = 'GOODCO';
  const badCode = 'BADCOD';
  const freeName = 'Free Name';
  const takenName = 'Taken Name';
  const reqWithNoBody = {nobody: 'this has no body'};
  const reqWithBodyNoCodeNoName = {
    body: {
      noCode: 'no room code',
      noName: 'no game name'
    }
  };
  const reqWithRoomCodeNoGameName = {
    body: {
      roomCode: goodCode
    }
  };
  const reqWithGameNameNoRoomCode = {
    body: {
      gameName: freeName
    }
  };
  const reqWithBadCodeFreeName = {
    body: {
      roomCode: badCode,
      gameName: freeName
    }
  };
  const gameNameSet = [freeName];
  const createSet = gameName => {
    if(gameName == freeName) {
      return gameNameSet;
    } else {
      return [gameName];
    }
  };
  const dbResponse1stParticipant = {
    Attributes: {
      participants: {
        type: 'String',
        values: [],
        wrapperName: 'Set'
      }
    }
  };
  const dbResponseTakenName = {
    Attributes: {
      participants: {
        type: 'String',
        values: [takenName],
        wrapperName: 'Set'
      }
    }
  };
  const goodReq = {body:{roomCode: goodCode, gameName: freeName}};
  const db = {
    createSet: createSet,
    update: (params, cb) => {
      // Check everything but name and code
      if(!params ||
        !params.ExpressionAttributeNames ||
        !params.ExpressionAttributeNames['#P'] ||
        params.ExpressionAttributeNames['#P'] != 'participants' ||
        !params.ExpressionAttributeValues ||
        !params.ExpressionAttributeValues[':p'] ||
        // params.ExpressionAttributeValues[':p'] != gameNameSet ||
        !params.Key ||
        !params.Key.room_code ||
        params.Key.room_code != goodCode ||
        !params.Key.lib_id ||
        params.Key.lib_id != '000' ||
        !params.ReturnValues ||
        params.ReturnValues != 'UPDATED_OLD' ||
        !params.TableName ||
        params.TableName != 'seders' ||
        !params.UpdateExpression ||
        params.UpdateExpression != 'ADD #P :p' ||
        !params.ConditionExpression ||
        params.ConditionExpression != 'attribute_exists(room_code)') {
           cb({err: 'there was an error'}, false);
         } else {
           cb(false, dbResponse1stParticipant);
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
  const runTest = async (req, expectedStatus, expectedResponseData) => {
    const handler = joinSeder(awsSdk);
    const result = await new Promise((resolve, reject) => {
      const res = {
        status: (s) => {
          if(s == expectedStatus) {
            return {
              send: (data) => {
                resolve({sentStatus: s, sentData: data});
              }
            };
          } else {
            resolve({sentStatust: s});
          }
        },
        send: (data) => {
          resolve({sentStatus: 200, sentData: data});
        }
      };
      handler(req, res);
    });
    expect(result.sentStatus).toEqual(expectedStatus);
    expect(result.sentData).toEqual(expectedResponseData);
  };
  test('req with no body', () => {
    return runTest(reqWithNoBody, 400, undefined);
  });
  test('req with body, no room code, no game name', () => {
    return runTest(reqWithBodyNoCodeNoName, 400, undefined);
  });
  test('req with room code, but no game name', () => {
    return runTest(reqWithRoomCodeNoGameName, 400, undefined);
  });
  test('req with game name, no room code', () => {
    return runTest(reqWithGameNameNoRoomCode, 400, undefined);
  });
  test('good req, 1st person to seder', () => {
    return runTest(goodReq, 200, dbResponse1stParticipant);
  });
  test('bad room code, free name', () => {
    return runTest(reqWithBadCodeFreeName, 400, undefined);
  });
  test('bad room code, taken name', () => {})
  test('good room code, taken name', () => {});
  const rt = async () => {expect(true).toBeFalsy()};
  test.skip('rt, illustrates expect-from-function pattern', () => {
    return rt();
  });
});

// TODO: don't insist that the input name set be the same object (same
// reference) as expected, just make sure it has the right contents