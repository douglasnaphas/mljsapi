/* globals expect */
const dbParams = require('./dbParamsAssignLibs');
const configs = require('../../Configs');
const schema = require('../../schema');
const responses = require('../../responses');
describe('assignLibsMiddleware/dbParamsAssignLibs', () => {
  const runTest = ({req, res, expectedDbParams, expectNext,
    expect500}) => {
    const middleware = dbParams();
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
  test('assign libs to 1 participant', () => {
    const roomCode = 'AABBCC';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
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
          },
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #A = :a',
              ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
              ExpressionAttributeValues: {':a':
                res.locals.participants[0].libs},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          }
        ]
      }
    ];
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.SORT_KEY}`] =
      res.locals.participants[0].lib_id;
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('assign libs to 1 other participant', () => {
    const roomCode = 'CARCAR';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
        scriptVersion: 'v1abc',
        participants: [
          {
            lib_id: 'participant#fffeee0123456789',
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
          },
          {
            Update: {
              TableName: schema.TABLE_NAME,
              Key: {},
              UpdateExpression: 'SET #A = :a',
              ExpressionAttributeNames: {'#A': schema.ASSIGNMENTS},
              ExpressionAttributeValues: {':a':
                res.locals.participants[0].libs},
              ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
            }
          }
        ]
      }
    ];
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.PARTITION_KEY}`] =
      roomCode;
    expectedDbParams[0].TransactItems[1].Update.Key[`${schema.SORT_KEY}`] =
      res.locals.participants[0].lib_id;
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test('assign libs to multiple participants', () => {});
  test('assign libs to more than 9 participants', () => {});
  test('assign libs to more than 29 participants', () => {});
  test('some participants have an empty libs array, skip them', () => {});
  test('some participants have no libs property, skip them', () => {});
  test('some participants have a non-array libs property', () => {});
  test('missing all values in res.locals', () => {
    const roomCode = 'SHLDFL';
    const req = {
      body: {
        roomCode: roomCode
      }
    };
    const res = {
      locals: {
        nothing: 'missing values'
      }
    };
    runTest({
      req: req,
      res: res,
      expect500: true
    });
  });
  test('missing roomCode', () => {
    const req = {
      body: {}
    };
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
      req: req,
      res: res,
      expect500: true
    });
  });
  test('missing participants in res.locals', () => {
    const roomCode = 'ROOMCO';
    const req = {
      body: {
        roomCode: 'ROOMCO'
      }
    };
    const res = {
      locals: {
        scriptVersion: 'youknowAVersion'
      }
    };
    runTest({
      req: req,
      res: res,
      expect500: true
    });
  });
  test('missing scriptVersion in res.locals', () => {
    const roomCode = 'ROOMCO';
    const req = {
      body: {
        roomCode: 'ROOMCO'
      }
    };
    const res = {
      locals: {
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
      req: req,
      res: res,
      expect500: true
    });
  });
  test('res.locals.participants is not an array, 500', () => {});
  test('res.locals.participants is 0-length, 500', () => {});
});