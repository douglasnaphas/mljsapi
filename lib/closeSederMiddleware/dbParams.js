/**
 * Return middleware satisfying:
 * pre: res.locals.gameName is set to a String
 * post: res.locals['closeSederDbParams'] is set to an object that will work as
 * params to DynamoDB's transactWrite, to:
 *   1) fail if the roomCode does not correspond to an existing seder,
 *   2) set closed to true for the seder otherwise
 * @return Express middleware that sets res.locals['closeSederDbParams'] based on
 * req.body and res.locals and calls next, or sends 500 on error
 */
function dbParams() {
  const schema = require('../../schema');
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.roomCode)
    {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.closeSederDbParams = {
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
    res.locals.closeSederDbParams.TransactItems[0].Update.Key
      [`${schema.PARTITION_KEY}`] = res.locals.roomCode;
    res.locals.closeSederDbParams.TransactItems[0].Update.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    return next();
  };
  return middleware;
}

module.exports = dbParams;