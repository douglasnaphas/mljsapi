/* globals expect */
const joinSeder = require('./joinSeder');

describe('joinSeder', () => {
  // codes
  const goodCode = 'GOODCO';
  const badCode = 'BADCOD';
  
  // names
  const freeNameEmptySeder = 'First to Seder';
  const freeNameCrowdedSeder = 'Late but Welcome';
  const takenNameOnePersonSeder = 'Taken at 1-Person Seder';
  const takenNameCrowdedSeder = 'Taken by Someone';
  
  // reqs
  // invalid
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
      gameName: freeNameEmptySeder
    }
  };
  // good code
  const goodReq = {body:{roomCode: goodCode, gameName: freeNameEmptySeder}};
  const reqWithBadCodeFreeName = {
    body: {
      roomCode: badCode,
      gameName: freeNameEmptySeder
    }
  };
  const reqWithGoodCodeTakenName = {
    roomCode: goodCode,
    gameName: takenNameOnePersonSeder
  }
  
  // db responses
  // good code
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
        values: [takenNameOnePersonSeder],
        wrapperName: 'Set'
      }
    }
  };
  // bad code: error (built in to update() logic)
  
  // db
  const createSet = gameName => [gameName];
  const db = {
    createSet: createSet,
    update: (params, cb) => {
      if(!params ||
        !params.ExpressionAttributeNames ||
        !params.ExpressionAttributeNames['#P'] ||
        params.ExpressionAttributeNames['#P'] != 'participants' ||
        !params.ExpressionAttributeValues ||
        !params.ExpressionAttributeValues[':p'] ||
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
         } else if(params.ExpressionAttributeValues[':p'][0] &&
           params.ExpressionAttributeValues[':p'][0] == freeNameEmptySeder) {
             cb(false, dbResponse1stParticipant);
         } else if(params.ExpressionAttributeValues[':p'][0] &&
           params.ExpressionAttributeValues[':p'][0] == takenNameOnePersonSeder) {
             cb(false, dbResponseTakenName);
         } else {
           cb({err: 'unkown error'}, false);
           // TODO: Fix this logic to avoid repeating the error case, and in the
           // meantime avoid having to list every failure condition, since I
           // will just be succeeding on success conditions and failing
           // otherwise
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
    return runTest(goodReq, 200, undefined);
  });
  test('bad room code, free name', () => {
    return runTest(reqWithBadCodeFreeName, 400, undefined);
  });
  test.skip('bad room code, taken name', () => {
    return runTest()
  })
  test('good room code, taken name', () => {});
  test('scale test, what if there are 100,000 people at a seder?', () => {
    /* TODO: set a participant limit, see if dynamo limits what it will return
    */
  });
  const rt = async () => {expect(true).toBeFalsy()};
  test.skip('rt, illustrates expect-from-function pattern', () => {
    return rt();
  });
});

// [good code, bad code] X
// [free name empty seder, free name crowded seder, taken name 1-person seder,
//  taken name crowded seder]