/**
 * Return middleware satisfying:
 * pre: res.locals.rosterDbParams is set to an valid object for params to
 * aws-sdk.DynamoDB.DocumentClient.query
 * post: awsSdk.DynamoDB.DocumentClient.query is executed with the
 * supplied params, and res.locals.dbData and res.locals.dbError are populated
 * with the data and error from the execution
 * @param {Function} awsSdk An object providing aws-sdk's
 * DynamoDB.DocumentClient.query and DynamoDB.DocumentClient constructor
 * @return {Function} Express middleware that executes query and calls next,
 * or sends 500 if res.locals.rosterDbParams is not defined
 */
function runQuery(awsSdk) {
  const middleware = async (req, res, next) => {
    const responses = require('../../responses');
    if(!res.locals.rosterDbParams) {
      return res.status(500).send(responses.SERVER_ERROR);
    }
    const dynamodb = new awsSdk.DynamoDB.DocumentClient();
    const dbResponse = await new Promise((resolve, reject) => {
      dynamodb.query(res.locals.rosterDbParams, (err, data) => {
        resolve({err: err, data: data});
      });
    });
    res.locals.dbError = dbResponse.err;
    res.locals.dbData = dbResponse.data;
    return next();
  };
  return middleware;
}
module.exports = runQuery;