/* globals expect */
const joinSeder = require('./joinSeder');

describe('joinSeder', () => {
  const reqWithNoBody = {nobody: 'this has no body'};
  const reqWithBodyNoCodeNoName = {
    body: {
      noCode: 'no room code',
      noName: 'no game name'
    }
  };
  const reqWithRoomCodeNoGameName = {};
  const goodCode = 'GOODCO';
  const badCode = 'BADCOD';
  const freeName = 'Free Name';
  const takenName = 'Taken Name';
  const gameNameSet = [freeName];
  const createSet = gameName => {
    if(gameName == freeName) {
      return gameNameSet;
    }
  };
  const db = {
    createSet: createSet,
    update: (params, cb) => {
      // Check everything but name and code
      if(!params ||
         !params.ExpressionAttributeNames ||
         !params.ExpressionAttributeNames['#P'] ||
         !params.ExpressionAttributeNames['#P'] == 'participants' ||
         !params.ExpressionAttributeValues ||
         !params.ExpressionAttributeValues[':p'] ||
         !params.ExpressionAttributeValues[':p'] == gameNameSet ||
         !params.Key ||
         !params.Key.room_code ||
         !params.Key.room_code == goodCode ||
         !params.Key.lib_id ||
         !params.Key.lib_id == '000' ||
         !params.ReturnValues ||
         !params.ReturnValues == 'UPDATED_OLD' ||
         !params.TableName ||
         !params.TableName == 'seders' ||
         !params.UpdateExpression ||
         !params.UpdateExpression == 'ADD #P :p') {
           cb({err: 'there was an error'}, false);
         } else {
           cb(false,
             {
               Attributes: {
                 participants: {
                   type: 'String'
                 }
                }
              }
            )
         }
    }
  };
  const awsSdk = {
    DocumentClient: class {
      constructor() {
        return db;
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
  test('...', () => {
    runTest(reqWithNoBody, 400, undefined);
  }); 
});