/* globals expect */
const dbParams = require('./dbParams');
const Configs = require('../../Configs');
const schema = require('../../schema');
describe('joinSederMiddleware/dbParams', () => {
  const defaultDate = new Date();
  const runTest = ({now, configs, req, res, expectedDbParams, expectNext,
    expect500}) => {
    now = now || defaultDate;
    configs = configs || Configs;
    const middleware = dbParams(now, configs);
    let nextCalled = false;
    let statusToSend = 200;
    let sentStatus;
    const next = () => { nextCalled = true };
    res.status = (s) => {
      statusToSend = s;
      return {
        send: () => { sentStatus = statusToSend }
      };
    };
    res.send = () => { sentStatus = statusToSend };
    middleware(req, res, next);
    if(expectedDbParams) {
      expect(res.locals.joinSederDbParams).toEqual(expectedDbParams);
    }
    if(expectNext) {
      expect(nextCalled).toBeTruty();
    }
    if(expect500) {
      expect(sentStatus).toEqual(500);
    }
  };
  test('happy path 1', () => {
    const req = {
      body: {
        roomCode: 'AABBCC',
        gameName: 'me for the game'
      }
    };
    const res = {
      locals: {
        gameNameSessionKey: 'RANDOMSTRINGOFLETTERS'
      }
    };
    const minCreated = defaultDate.getTime() - Configs.msToJoinSeder();
    const expectedDbParams = {
      TransactItems: [
        {
          ConditionCheck: {
            ConditionExpression: 'attribute_exists(room_code) AND #C > :mc',
            Key: {
              'room_code': req.body.roomCode,
              'lib_id': schema.SEDER_PREFIX
            },
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD',
            ExpressionAttributeNames: {
              '#C': schema.CREATED
            },
            ExpressionAttributeValues: {
              ':mc': minCreated
            }
          }
        },
        {
          Put: {
            'room_code': req.body.roomCode,
            'lib_id': schema.PARTICIPANT_PREFIX
          }
        }
      ]
    };
    
  });
});