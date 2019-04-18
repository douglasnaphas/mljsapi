/* globals expect */
const Logger = require('./Logger');
describe('lib/Logger.dbParams', () => {
  const runTest = ({roomCode, gameName, message, status, now, randomNumber,
    event, expectedParams}) => {
    const params = Logger.dbParams({roomCode: roomCode, gameName: gameName,
      message: message, status: status, now: now, randomNumber: randomNumber,
      event: event
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
    const randomNumber = (x, y) => {
      if(x === 1 && y === 1000000000) return 42;
      return 1;
    };
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
      now.toISOString() + '#' + 42;
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
    const randomNumber = (x, y) => {
      if(x === 1 && y === 1000000000) return 420;
      return 1;
    };
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
      now.toISOString() + '#' + 420;
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
    const now = {
      toISOString: () => ''
    }
    const randomNumber = (x, y) => {};
    const expectedParams = null;
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      status: status, expectedParams: expectedParams
    });
  });
  test('missing timestamp', () => {
    const roomCode = 'MISSTI';
    const gameName = 'Me My Other Name';
    const message = 'something else happened';
    const status = '403';
    const randomNumber = (x, y) => {};
    const expectedParams = null;
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      status: status, expectedParams: expectedParams
    });
  });
  test('missing randomNumber function', () => {
    const roomCode = 'MISSTI';
    const gameName = 'Me My Other Name';
    const message = 'something else happened';
    const status = '403';
    const now = {
      toISOString: () => ''
    }
    const expectedParams = null;
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      status: status, expectedParams: expectedParams
    });
  });
  test('missing gameName', () => {
    const roomCode = 'OTHERO';
    const message = 'something else happened';
    const status = '403';
    const now = {
      toISOString: () => '2019-06-28T13:31:31.838Z'
    }
    const randomNumber = (x, y) => {
      if(x === 1 && y === 1000000000) return 420;
      return 1;
    };
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
    expectedParams.TransactItems[0].Put.Item[Logger.message()] = message;
    expectedParams.TransactItems[0].Put.Item[Logger.status()] = status;
    expectedParams.TransactItems[0].Put.Item[Logger.sortKey()] =
      now.toISOString() + '#' + 420;
    runTest({roomCode: roomCode, message: message,
      status: status, now: now, randomNumber: randomNumber,
      expectedParams: expectedParams
    });
  });
  test('missing message', () => {
    const roomCode = 'OTHERO';
    const gameName = 'Me My Other Name';
    const status = '403';
    const now = {
      toISOString: () => '2019-06-28T13:31:31.838Z'
    }
    const randomNumber = (x, y) => {
      if(x === 1 && y === 1000000000) return 420;
      return 1;
    };
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
    expectedParams.TransactItems[0].Put.Item[Logger.status()] = status;
    expectedParams.TransactItems[0].Put.Item[Logger.sortKey()] =
      now.toISOString() + '#' + 420;
    runTest({roomCode: roomCode, gameName: gameName,
      status: status, now: now, randomNumber: randomNumber,
      expectedParams: expectedParams
    });
  });
  test('missing status', () => {
    const roomCode = 'OTHERO';
    const gameName = 'Me My Other Name';
    const message = 'something else happened';
    const now = {
      toISOString: () => '2019-06-28T13:31:31.838Z'
    }
    const randomNumber = (x, y) => {
      if(x === 1 && y === 1000000000) return 420;
      return 1;
    };
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
    expectedParams.TransactItems[0].Put.Item[Logger.sortKey()] =
      now.toISOString() + '#' + 420;
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      now: now, randomNumber: randomNumber,
      expectedParams: expectedParams
    });
  });
  test('event included', () => {
    const roomCode = 'OTHERO';
    const gameName = 'Me My Other Name';
    const message = 'something else happened';
    const status = '403';
    const now = {
      toISOString: () => '2019-06-28T13:31:31.838Z'
    }
    const randomNumber = (x, y) => {
      if(x === 1 && y === 1000000000) return 420;
      return 1;
    };
    const event = 'event type A';
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
    expectedParams.TransactItems[0].Put.Item
      [Logger.eventSortIdIndex().partitionKey] = event;
    expectedParams.TransactItems[0].Put.Item
      [Logger.eventSortIdIndex().sortKey] = now.toISOString() + '#' + 420;
    expectedParams.TransactItems[0].Put.Item[Logger.status()] = status;
    expectedParams.TransactItems[0].Put.Item[Logger.sortKey()] =
      now.toISOString() + '#' + 420;
    runTest({roomCode: roomCode, gameName: gameName, message: message,
      status: status, now: now, randomNumber: randomNumber, event: event,
      expectedParams: expectedParams
    });
  });
});