/**
 * pre:
 *   1) res.locals.roomCode is set
 *   2) res.locals.participants is an array of objects like:
 *        {lib_id: 'participant#abcdef0123456789',
 *         libs: [
 *           {id: 1, prompt: 'this is a lib'}
 *         ]}
 *   3) res.locals.scriptVersion is set
 * post: res.locals.assignLibsDbParams is set to an array of objects, the first
 * of which will set the script version and set the first 9 participant lib
 * sets. Objects after the first in the array will set further participant lib
 * sets, in groups of 10.
 */
function dbParams() {
  const schema = require('../../schema');
  const responses = require('../../responses');
  const middleware = (req, res, next) => {
    if(!res.locals.roomCode ||
       !res.locals.scriptVersion ||
       !res.locals.participants)
    {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    res.locals.assignLibsDbParams = [
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
          }
        ]
      }
    ];
    res.locals.assignLibsDbParams[0].TransactItems[0].Update.Key
      [`${schema.PARTITION_KEY}`] = res.locals.roomCode;
    res.locals.assignLibsDbParams[0].TransactItems[0].Update.Key
      [`${schema.SORT_KEY}`] = schema.SEDER_PREFIX;
    return next();
  };
  return middleware;
}

module.exports = dbParams;