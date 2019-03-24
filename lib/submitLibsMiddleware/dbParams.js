/**
 * Return middleware satisfying:
 * pre:
 *   1) res.locals.roomCode is set to a String (500 if missing)
 *   2) req.body.gameName is set to a String (400 if missing)
 *   3) req.body.answers is an array (400 if missing)
 * post: res.locals['closeSederDbParams'] is set to an object that will work as
 * params to DynamoDB's transactWrite, to:
 *   1) fail if the roomCode/gameName combo does not correspond to an existing
 *      participant,
 *   2) set the participant's answers field to req.body.answers otherwise
 */
function dbParams() {
  const schema = require('../../schema');
  const responses = require('../../responses');
  const api = require('../../api');
  const DbSchema = require('../../DbSchema');
  const middleware = (req, res, next) => {
    if(!Array.isArray(req.body[api.POST_BODY_PARAMS.ANSWERS])) {
      return res.status(400).send(responses.BAD_REQUEST);
    }
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
            UpdateExpression: 'SET #A = :a',
            ExpressionAttributeNames: {'#A': schema.ANSWERS},
            ExpressionAttributeValues: {':a': req.body.answers},
            ConditionExpression: 'attribute_exists(' + schema.ASSIGNMENTS + ')',
            ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
          }
        }
      ]
    };
    res.locals.closeSederDbParams.TransactItems[0].Update.Key
      [`${schema.PARTITION_KEY}`] = res.locals.roomCode;
    res.locals.closeSederDbParams.TransactItems[0].Update.Key
      [`${schema.SORT_KEY}`] = DbSchema.sortKeyFromGameName(req.body.gameName);
    return next();
  };
  return middleware;
}

module.exports = dbParams;