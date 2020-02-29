/**
 * Return middleware satisfying:
 * pre:
 *   1) res.locals has string properties nickname, email, sub, and
 *     cognito:username (500 if missing)
 * post: res.locals['dbParamsSaveUserTokenInfo'] is set to an object that will
 *   work as params to DynamoDB's transactWrite, to:
 *   1) create an item (sub, cognito:username#<SALT>) -> (nickname, email)
 */
function dbParamsSaveUserTokenInfo() {
  const schema = require('../schema');
  const responses = require('../responses');
  const api = require('../api');
  const DbSchema = require('../DbSchema');
  const middleware = (req, res, next) => {
    if(!res.locals.nickname || !res.locals.email || !res.locals.sub ||
      !res.locals["cognito:username"]) {
      return res.status(500).send(responses.SERVER_ERROR);  
    }
    res.locals.dbParamsSaveUserTokenInfo = {
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
    res.locals.dbParamsSaveUserTokenInfo.TransactItems[0].Update.Key
      [`${schema.PARTITION_KEY}`] = req.body.roomCode;
    res.locals.dbParamsSaveUserTokenInfo.TransactItems[0].Update.Key
      [`${schema.SORT_KEY}`] = DbSchema.sortKeyFromGameName(req.body.gameName);
    return next();
  };
  return middleware;
}

module.exports = dbParamsSaveUserTokenInfo;