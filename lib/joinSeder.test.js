/* globals expect */
const joinSeder = require('./joinSeder');

describe('joinSeder', () => {
  const now = new Date();
  const Configs = require('../Configs');
  
  // codes
  const goodCode = 'GOODCO';
  const badCode = 'BADCOD';
  
  // names
  const freeNameEmptySeder = 'First to Seder';
  const freeNameCrowdedSeder = 'Late but Welcome';
  const takenNameOnePersonSeder = 'Taken at 1-Person Seder';
  const takenNameCrowdedSeder = 'Taken by Someone';
  
  // names already at seders
  const namesAtOnePersonSeder = [takenNameOnePersonSeder];
  const namesAtCrowdedSeder = [takenNameCrowdedSeder, 'A Girlfriend',
    'A Friend', 'A Roommate', 'Cousin 1', 'Aunt Three'];
  
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
  const reqGoodCodeFreeNameEmptySeder = {
    body:{
      roomCode: goodCode,
      gameName: freeNameEmptySeder
    }
  };
  const reqGoodCodeFreeNameCrowdedSeder = {
    body: {
      roomCode: goodCode,
      gameName: freeNameCrowdedSeder
    }
  };
  const reqGoodCodeTakenNameOnePersonSeder = {
    body: {
      roomCode: goodCode,
      gameName: takenNameOnePersonSeder
    }
  }
  const reqGoodCodeTakenNameCrowdedSeder = {
    body: {
      roomCode: goodCode,
      gameName: takenNameCrowdedSeder
    }
  };
  // bad code
  const reqBadCodeFreeNameEmptySeder = {
    body: {
      roomCode: badCode,
      gameName: freeNameEmptySeder
    }
  };
  const reqBadCodeFreeNameCrowdedSeder = {
    body: {
      roomCode: badCode,
      gameName: freeNameCrowdedSeder
    }
  };
  const reqBadCodeTakenNameOnePersonSeder = {
    body: {
      roomCode: badCode,
      gameName: takenNameOnePersonSeder
    }
  };
  const reqBadCodeTakenNameCrowdedSeder = {
    body: {
      roomCode: badCode,
      gameName: takenNameCrowdedSeder
    }
  };
  
  // db responses
  // good code
  const dbResponseFreeNameEmptySeder = {};
  const dbResponseFreeNameCrowdedSeder = {
    Attributes: {
      participants: {
        type: 'String',
        values: namesAtCrowdedSeder,
        wrapperName: 'Set'
      }
    }
  };
  const dbResponseTakenNameOnePersonSeder = {
    Attributes: {
      participants: {
        type: 'String',
        values: namesAtOnePersonSeder,
        wrapperName: 'Set'
      }
    }
  };
  const dbResponseTakenNameCrowdedSeder = dbResponseFreeNameCrowdedSeder;
  // bad code: error (built in to update() logic)
  
  // db
  const createSet = gameName => [gameName];
  const conditionExpression =
    'attribute_exists(room_code) AND attribute_exists(created) AND created >' +
      ' :mc';
  const db = {
    createSet: createSet,
    update: (params, cb) => {
      if(!params ||
        !params.ExpressionAttributeNames ||
        !params.ExpressionAttributeNames['#P'] ||
        params.ExpressionAttributeNames['#P'] != 'participants' ||
        !params.ExpressionAttributeValues ||
        !params.ExpressionAttributeValues[':p'] ||
        !params.ExpressionAttributeValues[':mc'] ||
        (params.ExpressionAttributeValues[':mc'] != now.getTime() - 
          Configs.msToJoinSeder()) ||
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
        params.ConditionExpression != conditionExpression) {
          cb({err: 'there was an error'}, false);
        } else if(Array.isArray(params.ExpressionAttributeValues[':p'])) {
          if (params.ExpressionAttributeValues[':p'][0] == freeNameEmptySeder)
          {
            cb(false, dbResponseFreeNameEmptySeder);
          } else if (
            params.ExpressionAttributeValues[':p'][0] == freeNameCrowdedSeder) {
            cb(false, dbResponseFreeNameCrowdedSeder);
          } else if (params.ExpressionAttributeValues[':p'][0] == 
            takenNameOnePersonSeder) {
            cb(false, dbResponseTakenNameOnePersonSeder);
          } else if (
            params.ExpressionAttributeValues[':p'][0] == takenNameCrowdedSeder
            ) {
            cb(false, dbResponseTakenNameCrowdedSeder);
          }
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
  
  // endpoint responses
  const apiResponseNameTaken = {error: 'name taken'};
  
  const runTest = async (req, expectedStatus, expectedResponseData,
    expectedCookie) => {
    const handler = joinSeder(awsSdk, now, Configs);
    let cookieCalled = false;
    const cookies = [];
    const result = await new Promise((resolve, reject) => {
      const res = {
        cookie: (name, value, options) => {
          cookieCalled = true;
          cookies.push([name, value, options]);
        },
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
    if(expectedCookie) {
      expect(
        cookies.find(c => {
          c[0] == expectedCookie[0] &&
          c[1] == expectedCookie[1]})).toBeTruthy();
    }
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
  test('good code, 1st person to empty seder', () => { // 1
    return runTest(reqGoodCodeFreeNameEmptySeder, 200, undefined);
  });
  test('good code, free name, crowded seder', () => { // 2
    return runTest(reqGoodCodeFreeNameCrowdedSeder, 200, undefined);
  });
  test('good code, taken name, 1 other person at seder', () => { // 3
    return runTest(reqGoodCodeTakenNameOnePersonSeder, 400,
      apiResponseNameTaken)
  });
  test('good code, taken name, crowded seder', () => { // 4
    return runTest(reqGoodCodeTakenNameCrowdedSeder, 400,
      apiResponseNameTaken);
  });
  test('bad room code, free name, empty seder', () => { // 5
    return runTest(reqBadCodeFreeNameEmptySeder, 400, undefined);
  });
  test('bad code, free name, crowded seder', () => { // 6
    return runTest(reqBadCodeFreeNameCrowdedSeder, 400, undefined);
  });
  test('bad code, taken name, 1 person at seder', () => { // 7
    return runTest(reqBadCodeTakenNameOnePersonSeder, 400, undefined);
  });
  test('bad code, taken name, crowded seder', () => { // 8
    return runTest(reqBadCodeTakenNameCrowdedSeder, 400, undefined);
  });
  test('successful invocation should respond with a cookie', () => {
    
  });
  test('cookie should match what is in the DB', () => {});
  test('scale test, what if there are 100,000 people at a seder?', () => {
    /* TODO: set a participant limit, see if dynamo limits what it will return
    */
  });
  const rt = async () => {expect(true).toBeFalsy()};
  test.skip('rt, illustrates expect-from-function pattern', () => {
    return rt();
  });
});