/* globals expect */
const Logger = require('./Logger');
describe('lib/Logger.dbParams', () => {
  const runTest = ({roomCode, gameName, message, status, expectedParams}) => {
    const params = Logger.dbParams({roomCode: roomCode, gameName: gameName,
      message: message, status: status
    });
    expect(params).toEqual(expectedParams);
  };
  test('roomCode, gameName, message, status 1', () => {
    const roomCode = 'ROOMCO';
    const gameName = 'Me My Name';
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
  });
  test('missing roomCode', () => {});
});