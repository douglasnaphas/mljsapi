/**
 * Return middleware satisfying:
 * pre: res.locals.gameName is set to a String
 * post: res.locals['closeSederParams'] is set to an object that will work as
 * params to DynamoDB's transactWrite, to:
 *   1) fail if the roomCode does not correspond to an existing seder,
 *   2) set closed to true for the seder otherwise
 * @return Express middleware that sets res.locals['closeSederParams'] based on
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
    res.locals.closeSederParams = {
      TransactItems: [
        {
          Put: {
            Item: {},
            ConditionExpression: 'attribute_not_exists(room_code) AND ' +
              'attribute_not_exists(lib_id)',
            TableName: schema.TABLE_NAME,
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    res.locals.joinSederDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    res.locals.joinSederDbParams.TransactItems[0].ConditionCheck.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.SORT_KEY}`] = schema.PARTICIPANT_PREFIX + schema.SEPARATOR + 
      res.locals.gameNameHash;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.SESSION_KEY}`] = res.locals.gameNameSessionKey;
    res.locals.joinSederDbParams.TransactItems[1].Put.Item
      [`${schema.GAME_NAME}`] = req.body.gameName;
    return next();
  };
  return middleware;
}

module.exports = dbParams;