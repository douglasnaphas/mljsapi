/* globals expect */
const createSession = require('./createSession');

describe('createSession', () => {
  
  
  const runTest = async ({req, expectedStatus, expectedResponseData,
    expectNext, dbFail}) => {
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
        }
      }
    };
  };
  
  
  test('...', () => {});
});