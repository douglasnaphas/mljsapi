/* globals expect */
const dbParams = require('./dbParams');
const configs = require('../../Configs');
const schema = require('../../schema');
const responses = require('../../responses');
describe('closeSederMiddleware/dbParams', () => {
  const responses = require('../../responses');
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
      expect(res.locals.closeSederDbParams).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruthy();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
      expect(sentData).toEqual(responses.SERVER_ERROR);
    }
  };
  test.skip('happy path 1', () => {
    const req = {
      body: {
        roomCode: 'AABBCC',
        gameName: 'me for the game'
      }
    };
    const res = {
      locals: {
        gameNameSessionKey: 'RANDOMSTRINGOFLETTERS',
        gameNameHash: 'def321'
      }
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            TableName: schema.TABLE_NAME,
            Key: {},
            UpdateExpression: 'SET #C = :t',
            ExpressionAttributeNames: {'#C': schema.CLOSED},
            ExpressionAttributeValues: {':t': true},
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].Update.Key[`${schema.PARTITION_KEY}`] =
      res.locals.roomCode;
    expectedDbParams.TransactItems[0].Update.Key[`${schema.SORT_KEY}`] =
      schema.SEDER_PREFIX;
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test.skip('happy path 2', () => {
    const req = {
      body: {
        roomCode: 'XXBBCC',
        gameName: 'different name'
      }
    };
    const res = {
      locals: {
        gameNameSessionKey: 'DIFFERENTLETTERS',
        gameNameHash:'abc123'
      }
    };
    const expectedDbParams = {
      TransactItems: [
        {
          Update: {
            Key: {},
            ConditionExpression: 'attribute_not_exists(room_code) AND ' +
              'attribute_not_exists(lib_id)',
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SORT_KEY}`] = schema.PARTICIPANT_PREFIX + schema.SEPARATOR + 
      res.locals.gameNameHash;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.SESSION_KEY}`] = res.locals.gameNameSessionKey;
    expectedDbParams.TransactItems[1].Put.Item
      [`${schema.GAME_NAME}`] = req.body.gameName;
    runTest({
      req: req,
      res: res,
      expectedDbParams: expectedDbParams,
      expectNext: true
    });
  });
  test.skip('missing values in res.locals', () => {
    const req = {
      body: {
        roomCode: 'AABBCC',
        gameName: 'me for the game'
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
});