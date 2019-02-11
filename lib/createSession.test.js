/* globals expect */
const createSession = require('./createSession');

describe('createSession', () => {
  
  
  const runTest = async ({req, expectedStatus, expectedResponseData,
    expectNext}) => {
    let participantInDbCall;
    let sessionKeyInDbCall;
    const db =  {
    update: (params, cb) => {
      if(!params ||
        !params.ExpressionAttributeNames ||
        !params.ExpressionAttributeNames['#P'] ||
        params.ExpressionAttributeNames['#P'] != 'participant' ||
        !params.ExpressionAttributeNames['#S'] ||
        params.ExpressionAttributeNames['#S'] != 'session_key' ||
        !params.ExpressionAttributeValues ||
        !params.ExpressionAttributeValues[':p'] ||
        !params.ExpressionAttributeValues[':s']){
        cb({err: 'there was an error'}, false);
      } else {
        
      }
    }
  };
  };
  
  
  test('...', () => {});
});