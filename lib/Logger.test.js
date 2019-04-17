/* globals expect */
const Logger = require('./Logger');
describe('lib/Logger.dbParams', () => {
  const runTest = ({roomCode, gameName, message, status, now, randomNumber,
    expectedParams}) => {
    const params = Logger.dbParams({roomCode: roomCode, gameName: gameName,
      message: message, status: status, now: now, randomNumber: randomNumber
    });
    expect(params).toEqual(expectedParams);
  };
  test('roomCode, gameName, message, status, now, randomNumber 1', () => {
    const roomCode = 'ROOMCO';
    const gameName = 'Me My Name';
    const message = 'something happened';
    const status = '500';
    const now = {
      toISOString: () => '2019-03-28T13:31:31.888Z'
    }
    const randomNumber = (x, y) => 50;
    const expectedParams = {
      TransactItems: [
        {
          Put: {
            Item: {},
            TableName: Logger.tableName()
          }
        }
      ]
    };
    expectedParams.TransactItems[0].Put.Item[Logger.partitionKey()] = roomCode;
    expectedParams.TransactItems[0].Put.Item[Logger.gameName()] = gameName;
    expectedParams.TransactItems[0].Put.Item[Logger.message()] = message;
    expectedParams.TransactItems[0].Put.Item[Logger.status()] = status;
    expectedParams.TransactItems[0].Put.Item[Logger.sortKey()] =
      now.toISOString() + '#' + randomNumber();
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      status: status, now: now, randomNumber: randomNumber,
      expectedParams: expectedParams
    });
  });
  test('roomCode, gameName, message, status, now, randomNumber 2', () => {
    const roomCode = 'OTHERO';
    const gameName = 'Me My Other Name';
    const message = 'something else happened';
    const status = '403';
    const now = {
      toISOString: () => '2019-06-28T13:31:31.838Z'
    }
    const randomNumber = (x, y) => 51;
    const expectedParams = {
      TransactItems: [
        {
          Put: {
            Item: {},
            TableName: Logger.tableName()
          }
        }
      ]
    };
    expectedParams.TransactItems[0].Put.Item[Logger.partitionKey()] = roomCode;
    expectedParams.TransactItems[0].Put.Item[Logger.gameName()] = gameName;
    expectedParams.TransactItems[0].Put.Item[Logger.message()] = message;
    expectedParams.TransactItems[0].Put.Item[Logger.status()] = status;
    expectedParams.TransactItems[0].Put.Item[Logger.sortKey()] =
      now.toISOString() + '#' + randomNumber();
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      status: status, now: now, randomNumber: randomNumber,
      expectedParams: expectedParams
    });
  });
  test('missing roomCode', () => {
    const roomCode = undefined;
    const gameName = 'Me My Other Name';
    const message = 'something else happened';
    const status = '403';
    const expectedParams = null;
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      status: status, expectedParams: expectedParams
    });
  });
});