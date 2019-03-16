/* globals expect */
const dbParams = require('./dbParamsAssignLibs');
const configs = require('../../Configs');
const schema = require('../../schema');
const responses = require('../../responses');
describe('assignLibsMiddleware/dbParamsAssignLibs', () => {
  const runTest = ({res, expectedDbParams, expectNext,
    expect500}) => {
    const middleware = dbParams();
    const req = {};
    let nextCalled = false;
    let statusToSend = 200;
    let sentStatus;
    let sentData;
    const next = () => { nextCalled = true };
    res.status = (s) => {
      statusToSend = s;
      return {
        send: (d) => { sentStatus = statusToSend; sentData = d; }
      };
    };
    res.send = (d) => { sentStatus = statusToSend; sentData = d; };
    middleware(req, res, next);
    if(expectedDbParams) {
      expect(res.locals.assignLibsDbParams).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test('happy path 1', () => {
    const res = {
      locals: {
        roomCode: 'AABBCC',
        scriptVersion: 'donotforgetthescriptversion',
        participants: [
          {
            lib_id: 'participant#abcdef0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'},
              {id: 3, prompt: 'this has all props', sentence: 'You are a _',
               defaultAnswer: 'some default'},
              {id: 4, prompt: 'It will be', sentence: 'tiring as _',
               defaultAnswer: 'to enter all these participants'},
              {id: 5, prompt: 'and libs', sentence: 'but oh _',
               defaultAnswer: 'it must be done'}
            ]
          }
        ]
      }
    };
    const expectedDbParams = [
      {
        TransactItems: [
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #V = :v',
              ExpressionAttributeNames: {'#V': schema.SCRIPT_VERSION},
              ExpressionAttributeValues: {':v': res.locals.scriptVersion},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          }
        ]
      }
    ];
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      res.locals.roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    runTest({
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('happy path 2', () => {
    const res = {
      locals: {
        roomCode: 'CARCAR',
        scriptVersion: 'v1abc',
        participants: [
          {
            lib_id: 'participant#abcdef0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'},
              {id: 3, prompt: 'this has all props', sentence: 'You are a _',
               defaultAnswer: 'some default'},
              {id: 4, prompt: 'It will be', sentence: 'tiring as _',
               defaultAnswer: 'to enter all these participants'},
              {id: 5, prompt: 'and libs', sentence: 'but oh _',
               defaultAnswer: 'it must be done'}
            ]
          }
        ]
      }
    };
    const expectedDbParams = [
      {
        TransactItems: [
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #V = :v',
              ExpressionAttributeNames: {'#V': schema.SCRIPT_VERSION},
              ExpressionAttributeValues: {':v': res.locals.scriptVersion},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          }
        ]
      }
    ];
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      res.locals.roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    runTest({
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('assign libs to multiple participants', () => {});
  test('assign libs to more than 9 participants', () => {});
  test('assign libs to more than 29 participants', () => {});
  test('missing all values in res.locals', () => {
    const res = {
      locals: {
        nothing: 'missing values'
      }
    };
    runTest({
      res: res,
      expect500: true
    });
  });
  test('missing roomCode in res.locals', () => {
    const res = {
      locals: {
        scriptVersion: 'v1abc',
        participants: [
          {
            lib_id: 'participant#abcdef0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'}
            ]
          }
        ]
      }
    };
    runTest({
      res: res,
      expect500: true
    });
  });
  test('missing participants in res.locals', () => {
    const res = {
      locals: {
        roomCode: 'ROOMCO',
        scriptVersion: 'youknowAVersion'
      }
    };
    runTest({
      res: res,
      expect500: true
    });
  });
  test('missing scriptVersion in res.locals', () => {
    const res = {
      locals: {
        roomCode: 'ROOMCO',
        participants: [
          {
            lib_id: 'participant#abcdef0123456789',
            libs: [
              {id: 1, prompt: 'please lib'},
              {id: 2, prompt: 'no example, sentence, or default in this lib'}
            ]
          }
        ]
      }
    };
    runTest({
      res: res,
      expect500: true
    });
  });
});